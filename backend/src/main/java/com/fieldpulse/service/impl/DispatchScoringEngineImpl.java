package com.fieldpulse.service.impl;

import com.fieldpulse.domain.entity.Job;
import com.fieldpulse.domain.entity.Skill;
import com.fieldpulse.domain.entity.Technician;
import com.fieldpulse.domain.enums.JobPriority;
import com.fieldpulse.domain.enums.SlaRiskLevel;
import com.fieldpulse.domain.enums.TechnicianStatus;
import com.fieldpulse.dto.dispatch.ScoreBreakdownDto;
import com.fieldpulse.dto.dispatch.ScoredCandidateDto;
import com.fieldpulse.service.DispatchScoringEngine;
import com.fieldpulse.util.GeoDistanceCalculator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class DispatchScoringEngineImpl implements DispatchScoringEngine {

    private final double weightSkill;
    private final double weightDistance;
    private final double weightWorkload;
    private final double weightSla;

    public DispatchScoringEngineImpl(
            @Value("${FieldPulse.dispatch.weight-skill:0.35}") double weightSkill,
            @Value("${FieldPulse.dispatch.weight-distance:0.25}") double weightDistance,
            @Value("${FieldPulse.dispatch.weight-workload:0.20}") double weightWorkload,
            @Value("${FieldPulse.dispatch.weight-sla:0.20}") double weightSla) {
        this.weightSkill = weightSkill;
        this.weightDistance = weightDistance;
        this.weightWorkload = weightWorkload;
        this.weightSla = weightSla;
    }

    @Override
    public ScoredCandidateDto evaluateCandidate(Job job, Technician technician) {
        ScoredCandidateDto dto = new ScoredCandidateDto();
        dto.setTechnicianId(technician.getId());
        dto.setEmployeeCode(technician.getEmployeeCode());
        dto.setFullName(technician.getUser() != null
                ? technician.getUser().getFirstName() + " " + technician.getUser().getLastName()
                : technician.getEmployeeCode());
        dto.setPhone(technician.getPhone());
        dto.setCurrentLatitude(technician.getCurrentLatitude());
        dto.setCurrentLongitude(technician.getCurrentLongitude());
        dto.setRating(technician.getRating());
        dto.setActiveJobsCount(technician.getActiveJobsCount());
        dto.setMaxConcurrentJobs(technician.getMaxConcurrentJobs());

        // Geodesic distance in km via Haversine formula
        double distanceKm = GeoDistanceCalculator.calculateDistanceKm(
                technician.getCurrentLatitude(), technician.getCurrentLongitude(),
                job.getLatitude(), job.getLongitude()
        );
        dto.setDistanceKm(distanceKm);

        // 1. Hard Filter: Availability Status
        if (technician.getStatus() == TechnicianStatus.OFFLINE || technician.getStatus() == TechnicianStatus.ON_BREAK) {
            disqualify(dto, "Technician is currently " + technician.getStatus().name());
            return dto;
        }

        // 2. Hard Filter: Maximum Concurrent Jobs
        if (technician.getActiveJobsCount() >= technician.getMaxConcurrentJobs()) {
            disqualify(dto, String.format("Technician has reached capacity (%d/%d active jobs)",
                    technician.getActiveJobsCount(), technician.getMaxConcurrentJobs()));
            return dto;
        }

        // 3. Hard Filter: Mandatory Skill Matching
        Set<String> techSkills = (technician.getSkills() != null)
                ? technician.getSkills().stream().map(Skill::getCode).collect(Collectors.toSet())
                : Set.of();

        Set<String> requiredSkills = (job.getRequiredSkills() != null)
                ? job.getRequiredSkills().stream().map(Skill::getCode).collect(Collectors.toSet())
                : Set.of();

        Set<String> matched = new HashSet<>(requiredSkills);
        matched.retainAll(techSkills);
        dto.setMatchedSkills(matched);

        Set<String> missing = new HashSet<>(requiredSkills);
        missing.removeAll(techSkills);
        dto.setMissingSkills(missing);

        if (!missing.isEmpty()) {
            disqualify(dto, "Missing mandatory certified skills: " + String.join(", ", missing));
            return dto;
        }

        // --- Candidate Passed Hard Filters -> Compute Soft Scores ---
        dto.setEligible(true);

        // A. Skill Score (35%): Base 80 pts + up to 20 pts rating bonus
        double ratingBonus = 20.0;
        if (technician.getRating() != null) {
            ratingBonus = Math.min(20.0, (technician.getRating().doubleValue() / 5.0) * 20.0);
        }
        double skillScore = Math.min(100.0, 80.0 + ratingBonus);

        // B. Distance Score (25%): Linear decay, 0 km = 100, 50 km = 0
        double distanceScore = Math.max(0.0, 100.0 - (distanceKm * 2.0));

        // C. Workload Balance Score (20%): 100 if idle, 0 if at capacity
        double workloadRatio = (double) technician.getActiveJobsCount() / Math.max(1, technician.getMaxConcurrentJobs());
        double workloadScore = Math.max(0.0, (1.0 - workloadRatio) * 100.0);

        // D. SLA Urgency Score (20%): Derived from Priority & SLA Risk
        JobPriority priority = job.getPriority() != null ? job.getPriority() : JobPriority.MEDIUM;
        double slaScore = switch (priority) {
            case CRITICAL -> 100.0;
            case HIGH -> 80.0;
            case MEDIUM -> 60.0;
            case LOW -> 40.0;
        };

        if (job.getSla() != null) {
            if (job.getSla().getRiskLevel() == SlaRiskLevel.WARNING) {
                slaScore = Math.min(100.0, slaScore + 10.0);
            } else if (job.getSla().getRiskLevel() == SlaRiskLevel.BREACHED) {
                slaScore = 100.0;
            }
        }

        // Weighted total calculation (0.0 to 100.0)
        double total = (weightSkill * skillScore)
                + (weightDistance * distanceScore)
                + (weightWorkload * workloadScore)
                + (weightSla * slaScore);

        double totalScore = Math.round(total * 100.0) / 100.0;
        dto.setTotalScore(totalScore);

        String details = String.format("Score: %.2f [Skill: %.1f (%.0f%%), Distance: %.1fkm -> %.1f (%.0f%%), Workload: %d/%d -> %.1f (%.0f%%), SLA: %s -> %.1f (%.0f%%)]",
                totalScore,
                skillScore, weightSkill * 100,
                distanceKm, distanceScore, weightDistance * 100,
                technician.getActiveJobsCount(), technician.getMaxConcurrentJobs(), workloadScore, weightWorkload * 100,
                priority.name(), slaScore, weightSla * 100);

        dto.setScoreBreakdown(new ScoreBreakdownDto(
                Math.round(skillScore * 100.0) / 100.0,
                Math.round(distanceScore * 100.0) / 100.0,
                Math.round(workloadScore * 100.0) / 100.0,
                Math.round(slaScore * 100.0) / 100.0,
                totalScore,
                details
        ));

        return dto;
    }

    private void disqualify(ScoredCandidateDto dto, String reason) {
        dto.setEligible(false);
        dto.setDisqualificationReason(reason);
        dto.setTotalScore(0.0);
        dto.setScoreBreakdown(new ScoreBreakdownDto(0.0, 0.0, 0.0, 0.0, 0.0, "Disqualified: " + reason));
    }
}
