package com.opsflow.service;

import com.opsflow.domain.entity.*;
import com.opsflow.domain.enums.*;
import com.opsflow.dto.dispatch.*;
import com.opsflow.exception.BusinessValidationException;
import com.opsflow.exception.StateTransitionException;
import com.opsflow.repository.AssignmentRepository;
import com.opsflow.repository.JobRepository;
import com.opsflow.repository.TechnicianRepository;
import com.opsflow.service.impl.DispatchServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DispatchServiceTest {

    @Mock
    private JobRepository jobRepository;

    @Mock
    private TechnicianRepository technicianRepository;

    @Mock
    private AssignmentRepository assignmentRepository;

    @Mock
    private DispatchScoringEngine scoringEngine;

    @Mock
    private AuditService auditService;

    @Mock
    private InventoryService inventoryService;

    private DispatchService dispatchService;

    @BeforeEach
    void setUp() {
        dispatchService = new DispatchServiceImpl(
                jobRepository,
                technicianRepository,
                assignmentRepository,
                scoringEngine,
                auditService,
                inventoryService
        );
    }

    private Job createTestJob(JobStatus status) {
        Job job = new Job();
        job.setId(50L);
        job.setJobNumber("JOB-2026-0050");
        job.setStatus(status);
        job.setPriority(JobPriority.HIGH);
        job.setLatitude(new BigDecimal("37.7749"));
        job.setLongitude(new BigDecimal("-122.4194"));
        return job;
    }

    private Technician createTestTechnician(Long id, String code) {
        Technician tech = new Technician();
        tech.setId(id);
        tech.setEmployeeCode(code);
        tech.setStatus(TechnicianStatus.AVAILABLE);
        tech.setMaxConcurrentJobs(2);
        tech.setActiveJobsCount(0);

        User user = new User();
        user.setEmail(code.toLowerCase() + "@opsflow.io");
        user.setFirstName("Tech");
        user.setLastName(code);
        tech.setUser(user);
        return tech;
    }

    @Test
    @DisplayName("Should rank recommendations descending by total dispatch score")
    void testGetRecommendationsRanking() {
        Job job = createTestJob(JobStatus.TRIAGED);
        Technician tech1 = createTestTechnician(1L, "TECH-001");
        Technician tech2 = createTestTechnician(2L, "TECH-002");

        ScoredCandidateDto cand1 = new ScoredCandidateDto();
        cand1.setTechnicianId(1L);
        cand1.setEligible(true);
        cand1.setTotalScore(75.50);
        cand1.setDistanceKm(12.0);

        ScoredCandidateDto cand2 = new ScoredCandidateDto();
        cand2.setTechnicianId(2L);
        cand2.setEligible(true);
        cand2.setTotalScore(92.00);
        cand2.setDistanceKm(4.0);

        when(jobRepository.findById(50L)).thenReturn(Optional.of(job));
        when(technicianRepository.findAll()).thenReturn(List.of(tech1, tech2));
        when(scoringEngine.evaluateCandidate(job, tech1)).thenReturn(cand1);
        when(scoringEngine.evaluateCandidate(job, tech2)).thenReturn(cand2);

        DispatchRecommendationResponseDto response = dispatchService.getRecommendations(50L, null);

        assertNotNull(response);
        assertEquals(2, response.getTotalCandidatesEvaluated());
        assertEquals(2, response.getEligibleCandidatesCount());
        // cand2 (92.00) should be ranked first before cand1 (75.50)
        assertEquals(2L, response.getRecommendations().get(0).getTechnicianId());
        assertEquals(92.00, response.getRecommendations().get(0).getTotalScore());
        assertEquals(1L, response.getRecommendations().get(1).getTechnicianId());
    }

    @Test
    @DisplayName("Should successfully confirm assignment, update job status to ASSIGNED, and record audit log")
    void testConfirmAssignmentSuccess() {
        Job job = createTestJob(JobStatus.TRIAGED);
        Technician tech = createTestTechnician(1L, "TECH-001");
        User caller = new User();
        caller.setEmail("dispatcher.sarah@opsflow.io");

        ConfirmAssignmentDto dto = new ConfirmAssignmentDto(50L, 1L, "Priority dispatch to primary technician");

        ScoredCandidateDto eligibleEvaluation = new ScoredCandidateDto();
        eligibleEvaluation.setEligible(true);
        eligibleEvaluation.setTotalScore(88.50);
        eligibleEvaluation.setScoreBreakdown(new ScoreBreakdownDto(90, 85, 100, 80, 88.50, "Full match"));

        when(jobRepository.findById(50L)).thenReturn(Optional.of(job));
        when(technicianRepository.findById(1L)).thenReturn(Optional.of(tech));
        when(scoringEngine.evaluateCandidate(job, tech)).thenReturn(eligibleEvaluation);
        when(assignmentRepository.save(any(Assignment.class))).thenAnswer(inv -> {
            Assignment a = inv.getArgument(0);
            a.setId(999L);
            return a;
        });

        AssignmentDto result = dispatchService.confirmAssignment(dto, caller);

        assertNotNull(result);
        assertEquals(999L, result.getId());
        assertEquals(JobStatus.ASSIGNED, job.getStatus());
        assertEquals(tech, job.getAssignedTechnician());
        assertEquals(1, tech.getActiveJobsCount());

        verify(jobRepository, times(1)).save(job);
        verify(technicianRepository, times(1)).save(tech);
        verify(auditService, times(1)).logEvent(
                eq("Job"),
                eq(50L),
                eq(AuditAction.JOB_ASSIGNED),
                eq(caller),
                eq("TRIAGED"),
                eq("ASSIGNED"),
                any()
        );
    }

    @Test
    @DisplayName("Should reject assignment if candidate is disqualified by scoring engine")
    void testConfirmAssignmentFailsForDisqualifiedCandidate() {
        Job job = createTestJob(JobStatus.TRIAGED);
        Technician tech = createTestTechnician(1L, "TECH-001");

        ConfirmAssignmentDto dto = new ConfirmAssignmentDto(50L, 1L, "Assign anyway");

        ScoredCandidateDto disqualified = new ScoredCandidateDto();
        disqualified.setEligible(false);
        disqualified.setDisqualificationReason("Missing mandatory certified skills: HVAC_COMMERCIAL");

        when(jobRepository.findById(50L)).thenReturn(Optional.of(job));
        when(technicianRepository.findById(1L)).thenReturn(Optional.of(tech));
        when(scoringEngine.evaluateCandidate(job, tech)).thenReturn(disqualified);

        BusinessValidationException ex = assertThrows(
                BusinessValidationException.class,
                () -> dispatchService.confirmAssignment(dto, null)
        );

        assertTrue(ex.getMessage().contains("Cannot dispatch technician"));
        verify(assignmentRepository, never()).save(any());
        verify(jobRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw StateTransitionException if job is already in COMPLETED status")
    void testConfirmAssignmentFailsOnCompletedJob() {
        Job job = createTestJob(JobStatus.COMPLETED);
        ConfirmAssignmentDto dto = new ConfirmAssignmentDto(50L, 1L, "Notes");

        when(jobRepository.findById(50L)).thenReturn(Optional.of(job));

        assertThrows(
                StateTransitionException.class,
                () -> dispatchService.confirmAssignment(dto, null)
        );

        verify(assignmentRepository, never()).save(any());
    }
}
