package com.opsflow.service.impl;

import com.opsflow.domain.entity.*;
import com.opsflow.domain.enums.*;
import com.opsflow.dto.dispatch.*;
import com.opsflow.exception.BusinessValidationException;
import com.opsflow.exception.ResourceNotFoundException;
import com.opsflow.exception.StateTransitionException;
import com.opsflow.repository.AssignmentRepository;
import com.opsflow.repository.JobRepository;
import com.opsflow.repository.TechnicianRepository;
import com.opsflow.service.AuditService;
import com.opsflow.service.DispatchScoringEngine;
import com.opsflow.service.DispatchService;
import com.opsflow.service.InventoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DispatchServiceImpl implements DispatchService {

    private final JobRepository jobRepository;
    private final TechnicianRepository technicianRepository;
    private final AssignmentRepository assignmentRepository;
    private final DispatchScoringEngine scoringEngine;
    private final AuditService auditService;
    private final InventoryService inventoryService;

    public DispatchServiceImpl(
            JobRepository jobRepository,
            TechnicianRepository technicianRepository,
            AssignmentRepository assignmentRepository,
            DispatchScoringEngine scoringEngine,
            AuditService auditService,
            InventoryService inventoryService) {
        this.jobRepository = jobRepository;
        this.technicianRepository = technicianRepository;
        this.assignmentRepository = assignmentRepository;
        this.scoringEngine = scoringEngine;
        this.auditService = auditService;
        this.inventoryService = inventoryService;
    }

    @Override
    @Transactional(readOnly = true)
    public DispatchRecommendationResponseDto getRecommendations(Long jobId, Double maxDistanceKm) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        if (job.getStatus() == JobStatus.COMPLETED || job.getStatus() == JobStatus.CANCELLED) {
            throw new BusinessValidationException("Cannot dispatch a " + job.getStatus().name() + " job.");
        }

        List<Technician> technicians = technicianRepository.findAll();
        List<ScoredCandidateDto> candidateList = new ArrayList<>();

        int eligibleCount = 0;
        for (Technician tech : technicians) {
            ScoredCandidateDto candidate = scoringEngine.evaluateCandidate(job, tech);

            // If max distance filter is specified and technician exceeds radius, mark outside radius
            if (maxDistanceKm != null && candidate.getDistanceKm() > maxDistanceKm && candidate.isEligible()) {
                candidate.setEligible(false);
                candidate.setDisqualificationReason(String.format("Exceeds maximum dispatch radius (%.1f km > %.1f km)",
                        candidate.getDistanceKm(), maxDistanceKm));
                candidate.setTotalScore(0.0);
            }

            if (candidate.isEligible()) {
                eligibleCount++;
            }
            candidateList.add(candidate);
        }

        // Sort candidates: eligible first, then total score descending, then distance ascending
        candidateList.sort(Comparator
                .comparing(ScoredCandidateDto::isEligible, Comparator.reverseOrder())
                .thenComparing(ScoredCandidateDto::getTotalScore, Comparator.reverseOrder())
                .thenComparing(ScoredCandidateDto::getDistanceKm));

        DispatchRecommendationResponseDto response = new DispatchRecommendationResponseDto();
        response.setJobId(job.getId());
        response.setJobNumber(job.getJobNumber());
        response.setTitle(job.getServiceRequest() != null ? job.getServiceRequest().getDescription() : "Job #" + job.getJobNumber());
        response.setPriority(job.getPriority());
        response.setStatus(job.getStatus());
        response.setAddress(job.getAddress());
        response.setLatitude(job.getLatitude());
        response.setLongitude(job.getLongitude());
        response.setScheduledStartTime(job.getScheduledStartTime());

        if (job.getRequiredSkills() != null) {
            response.setRequiredSkills(job.getRequiredSkills().stream()
                    .map(Skill::getCode)
                    .collect(Collectors.toSet()));
        }

        response.setRecommendations(candidateList);
        response.setTotalCandidatesEvaluated(technicians.size());
        response.setEligibleCandidatesCount(eligibleCount);

        return response;
    }

    @Override
    @Transactional
    public AssignmentDto confirmAssignment(ConfirmAssignmentDto dto, User caller) {
        Job job = jobRepository.findById(dto.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", dto.getJobId()));

        JobStatus currentStatus = job.getStatus();
        if (currentStatus != JobStatus.TRIAGED && currentStatus != JobStatus.ASSIGNED) {
            if (!currentStatus.canTransitionTo(JobStatus.ASSIGNED)) {
                throw new StateTransitionException("Job #" + job.getJobNumber(), currentStatus.name(), JobStatus.ASSIGNED.name());
            }
        }

        Technician technician = technicianRepository.findById(dto.getTechnicianId())
                .orElseThrow(() -> new ResourceNotFoundException("Technician", "id", dto.getTechnicianId()));

        // Evaluate candidate hard & soft constraints
        ScoredCandidateDto candidate = scoringEngine.evaluateCandidate(job, technician);
        if (!candidate.isEligible()) {
            throw new BusinessValidationException("Cannot dispatch technician " + technician.getEmployeeCode() +
                    ": " + candidate.getDisqualificationReason());
        }

        AuditAction auditAction = (currentStatus == JobStatus.ASSIGNED)
                ? AuditAction.JOB_REASSIGNED
                : AuditAction.JOB_ASSIGNED;

        // Transactional inventory reservation: lock & reserve parts
        inventoryService.reservePartsForJob(job.getId(), caller);

        // Create Assignment record
        Assignment assignment = new Assignment();
        assignment.setJob(job);
        assignment.setTechnician(technician);
        assignment.setAssignedBy(caller);
        assignment.setDispatchScore(BigDecimal.valueOf(candidate.getTotalScore()));
        assignment.setScoreExplanation(candidate.getScoreBreakdown() != null
                ? candidate.getScoreBreakdown().getDetails()
                : "Assigned with score " + candidate.getTotalScore());
        assignment.setStatus(AssignmentStatus.OFFERED);

        Assignment savedAssignment = assignmentRepository.save(assignment);

        // Update Job state
        job.setAssignedTechnician(technician);
        job.setStatus(JobStatus.ASSIGNED);
        jobRepository.save(job);

        // Update Technician workload
        technician.setActiveJobsCount(technician.getActiveJobsCount() + 1);
        if (technician.getActiveJobsCount() >= technician.getMaxConcurrentJobs()) {
            technician.setStatus(TechnicianStatus.ON_JOB);
        }
        technicianRepository.save(technician);

        // Immutable Audit Log
        Map<String, String> auditMetadata = new HashMap<>();
        auditMetadata.put("technicianId", technician.getId().toString());
        auditMetadata.put("technicianCode", technician.getEmployeeCode());
        auditMetadata.put("dispatchScore", String.valueOf(candidate.getTotalScore()));
        if (dto.getNotes() != null) {
            auditMetadata.put("notes", dto.getNotes());
        }

        auditService.logEvent(
                "Job",
                job.getId(),
                auditAction,
                caller,
                currentStatus.name(),
                JobStatus.ASSIGNED.name(),
                auditMetadata
        );

        return mapToDto(savedAssignment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDto> getAssignmentsForTechnician(Long technicianId) {
        return assignmentRepository.findByTechnicianId(technicianId)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentDto> getAssignmentsForJob(Long jobId) {
        return assignmentRepository.findByJobId(jobId)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    private AssignmentDto mapToDto(Assignment a) {
        AssignmentDto dto = new AssignmentDto();
        dto.setId(a.getId());
        if (a.getJob() != null) {
            dto.setJobId(a.getJob().getId());
            dto.setJobNumber(a.getJob().getJobNumber());
        }
        if (a.getTechnician() != null) {
            dto.setTechnicianId(a.getTechnician().getId());
            dto.setTechnicianEmployeeCode(a.getTechnician().getEmployeeCode());
            dto.setTechnicianName(a.getTechnician().getUser() != null
                    ? a.getTechnician().getUser().getFirstName() + " " + a.getTechnician().getUser().getLastName()
                    : a.getTechnician().getEmployeeCode());
        }
        if (a.getAssignedBy() != null) {
            dto.setAssignedBy(a.getAssignedBy().getEmail());
        }
        dto.setDispatchScore(a.getDispatchScore());
        dto.setScoreExplanation(a.getScoreExplanation());
        dto.setStatus(a.getStatus());
        dto.setOfferedAt(a.getOfferedAt());
        dto.setRespondedAt(a.getRespondedAt());
        dto.setRejectionReason(a.getRejectionReason());
        return dto;
    }
}
