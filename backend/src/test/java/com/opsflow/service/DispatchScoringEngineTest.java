package com.opsflow.service;

import com.opsflow.domain.entity.Job;
import com.opsflow.domain.entity.Skill;
import com.opsflow.domain.entity.Technician;
import com.opsflow.domain.entity.User;
import com.opsflow.domain.enums.JobPriority;
import com.opsflow.domain.enums.TechnicianStatus;
import com.opsflow.dto.dispatch.ScoredCandidateDto;
import com.opsflow.service.impl.DispatchScoringEngineImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class DispatchScoringEngineTest {

    private DispatchScoringEngine scoringEngine;

    @BeforeEach
    void setUp() {
        scoringEngine = new DispatchScoringEngineImpl(0.35, 0.25, 0.20, 0.20);
    }

    private Job createTestJob() {
        Job job = new Job();
        job.setId(10L);
        job.setJobNumber("JOB-2026-0001");
        job.setPriority(JobPriority.CRITICAL);
        job.setLatitude(new BigDecimal("37.7749"));
        job.setLongitude(new BigDecimal("-122.4194"));

        Skill skill1 = new Skill();
        skill1.setId(1L);
        skill1.setCode("HVAC_COMMERCIAL");
        skill1.setName("Commercial HVAC");

        job.setRequiredSkills(Set.of(skill1));
        return job;
    }

    private Technician createTestTechnician() {
        Technician tech = new Technician();
        tech.setId(1L);
        tech.setEmployeeCode("TECH-001");
        tech.setPhone("555-0101");
        tech.setStatus(TechnicianStatus.AVAILABLE);
        tech.setMaxConcurrentJobs(2);
        tech.setActiveJobsCount(0);
        tech.setRating(new BigDecimal("4.80"));
        tech.setCurrentLatitude(new BigDecimal("37.7749"));
        tech.setCurrentLongitude(new BigDecimal("-122.4194"));

        User user = new User();
        user.setFirstName("Alex");
        user.setLastName("Mercer");
        user.setEmail("tech.alex@opsflow.io");
        tech.setUser(user);

        Skill skill1 = new Skill();
        skill1.setId(1L);
        skill1.setCode("HVAC_COMMERCIAL");
        skill1.setName("Commercial HVAC");

        tech.setSkills(Set.of(skill1));
        return tech;
    }

    @Test
    @DisplayName("Should qualify eligible candidate with perfect skills and proximity with high score")
    void testEligibleCandidateScoring() {
        Job job = createTestJob();
        Technician tech = createTestTechnician();

        ScoredCandidateDto result = scoringEngine.evaluateCandidate(job, tech);

        assertTrue(result.isEligible());
        assertNull(result.getDisqualificationReason());
        assertEquals(0.0, result.getDistanceKm(), 0.01);
        assertTrue(result.getMissingSkills().isEmpty());
        assertTrue(result.getMatchedSkills().contains("HVAC_COMMERCIAL"));

        // Skill: 80 + (4.8/5.0 * 20) = 99.2 (35%) -> 34.72
        // Distance: 0 km -> 100.0 (25%) -> 25.00
        // Workload: 0/2 active -> 100.0 (20%) -> 20.00
        // SLA: CRITICAL -> 100.0 (20%) -> 20.00
        // Total ~ 99.72
        assertTrue(result.getTotalScore() >= 95.0, "Expected score >= 95.0, got: " + result.getTotalScore());
        assertNotNull(result.getScoreBreakdown());
        assertTrue(result.getScoreBreakdown().getDetails().contains("Score:"));
    }

    @Test
    @DisplayName("Hard Filter: Should disqualify technician missing mandatory certified skill")
    void testDisqualifyMissingSkill() {
        Job job = createTestJob();
        Technician tech = createTestTechnician();

        // Technician does not have HVAC_COMMERCIAL
        Skill otherSkill = new Skill();
        otherSkill.setId(2L);
        otherSkill.setCode("ELECTRICAL_HIGH_VOLTAGE");
        tech.setSkills(Set.of(otherSkill));

        ScoredCandidateDto result = scoringEngine.evaluateCandidate(job, tech);

        assertFalse(result.isEligible());
        assertEquals(0.0, result.getTotalScore());
        assertTrue(result.getDisqualificationReason().contains("Missing mandatory certified skills"));
        assertTrue(result.getMissingSkills().contains("HVAC_COMMERCIAL"));
    }

    @Test
    @DisplayName("Hard Filter: Should disqualify technician at maximum concurrent job capacity")
    void testDisqualifyAtMaxCapacity() {
        Job job = createTestJob();
        Technician tech = createTestTechnician();
        tech.setMaxConcurrentJobs(1);
        tech.setActiveJobsCount(1); // at capacity

        ScoredCandidateDto result = scoringEngine.evaluateCandidate(job, tech);

        assertFalse(result.isEligible());
        assertEquals(0.0, result.getTotalScore());
        assertTrue(result.getDisqualificationReason().contains("reached capacity"));
    }

    @Test
    @DisplayName("Hard Filter: Should disqualify technician who is OFFLINE or ON_BREAK")
    void testDisqualifyUnavailableStatus() {
        Job job = createTestJob();
        Technician tech = createTestTechnician();
        tech.setStatus(TechnicianStatus.OFFLINE);

        ScoredCandidateDto result = scoringEngine.evaluateCandidate(job, tech);

        assertFalse(result.isEligible());
        assertTrue(result.getDisqualificationReason().contains("OFFLINE"));
    }

    @Test
    @DisplayName("Distance decay: score should decrease proportionally as travel distance increases")
    void testDistanceDecay() {
        Job job = createTestJob();
        Technician techClose = createTestTechnician();
        techClose.setCurrentLatitude(new BigDecimal("37.7749")); // 0 km
        techClose.setCurrentLongitude(new BigDecimal("-122.4194"));

        Technician techFar = createTestTechnician();
        techFar.setId(2L);
        techFar.setCurrentLatitude(new BigDecimal("37.8044")); // Oakland (~13.3 km)
        techFar.setCurrentLongitude(new BigDecimal("-122.2711"));

        ScoredCandidateDto closeResult = scoringEngine.evaluateCandidate(job, techClose);
        ScoredCandidateDto farResult = scoringEngine.evaluateCandidate(job, techFar);

        assertTrue(closeResult.getTotalScore() > farResult.getTotalScore(),
                "Closer technician should score higher than distant technician");
        assertTrue(farResult.getDistanceKm() > 10.0);
    }
}
