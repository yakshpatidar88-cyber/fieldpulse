package com.fieldpulse.service.impl;

import com.fieldpulse.domain.entity.*;
import com.fieldpulse.domain.enums.AuditAction;
import com.fieldpulse.domain.enums.JobPriority;
import com.fieldpulse.domain.enums.JobStatus;
import com.fieldpulse.domain.enums.SlaRiskLevel;
import com.fieldpulse.domain.enums.TechnicianStatus;
import com.fieldpulse.dto.*;
import com.fieldpulse.dto.triage.JobStatusTransitionDto;
import com.fieldpulse.exception.BusinessValidationException;
import com.fieldpulse.exception.ResourceNotFoundException;
import com.fieldpulse.exception.StateTransitionException;
import com.fieldpulse.repository.JobRepository;
import com.fieldpulse.service.AuditService;
import com.fieldpulse.service.InventoryService;
import com.fieldpulse.service.JobService;
import com.fieldpulse.service.SlaService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final SlaService slaService;
    private final AuditService auditService;
    private final InventoryService inventoryService;

    public JobServiceImpl(JobRepository jobRepository,
                          SlaService slaService,
                          AuditService auditService,
                          InventoryService inventoryService) {
        this.jobRepository = jobRepository;
        this.slaService = slaService;
        this.auditService = auditService;
        this.inventoryService = inventoryService;
    }

    @Override
    @Transactional(readOnly = true)
    public JobDto getJobById(Long id) {
        return jobRepository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", id));
    }

    @Override
    @Transactional(readOnly = true)
    public JobDto getJobByJobNumber(String jobNumber) {
        return jobRepository.findByJobNumber(jobNumber)
                .map(this::mapToDto)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "jobNumber", jobNumber));
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobSummaryDto> getAllJobs(JobStatus status, JobPriority priority) {
        List<Job> list;
        if (status != null) {
            list = jobRepository.findByStatus(status);
        } else if (priority != null) {
            list = jobRepository.findByPriority(priority);
        } else {
            list = jobRepository.findAll();
        }

        return list.stream().map(this::mapToSummaryDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobSummaryDto> getActiveJobsForTechnician(Long technicianId) {
        return jobRepository.findActiveJobsForTechnician(technicianId)
                .stream()
                .map(this::mapToSummaryDto)
                .toList();
    }

    @Override
    @Transactional
    public JobDto transitionJobStatus(Long jobId, JobStatusTransitionDto transitionDto, User caller) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        JobStatus currentStatus = job.getStatus();
        JobStatus targetStatus = transitionDto.getStatus();

        if (!currentStatus.canTransitionTo(targetStatus)) {
            throw new StateTransitionException("Job #" + job.getJobNumber(), currentStatus.name(), targetStatus.name());
        }

        Instant now = Instant.now();
        AuditAction auditAction = determineAuditAction(targetStatus);

        // State-specific business rules
        if (targetStatus == JobStatus.COMPLETED) {
            if (transitionDto.getNotes() == null || transitionDto.getNotes().isBlank()) {
                throw new BusinessValidationException("Completion notes are mandatory to complete a field job.");
            }
            job.setCompletedAt(now);
            job.setCompletionNotes(transitionDto.getNotes());
            if (job.getSla() != null) {
                slaService.recordResolution(job.getSla(), now);
            }
            // Permanently consume reserved inventory parts
            inventoryService.consumePartsForJob(job.getId(), caller);

            // Free technician workload
            if (job.getAssignedTechnician() != null) {
                Technician tech = job.getAssignedTechnician();
                tech.setActiveJobsCount(Math.max(0, tech.getActiveJobsCount() - 1));
                if (tech.getStatus() == TechnicianStatus.ON_JOB) {
                    tech.setStatus(TechnicianStatus.AVAILABLE);
                }
            }
        } else if (targetStatus == JobStatus.IN_PROGRESS) {
            if (job.getActualStartTime() == null) {
                job.setActualStartTime(now);
            }
        } else if (targetStatus == JobStatus.ACCEPTED) {
            if (job.getSla() != null && job.getSla().getRespondedAt() == null) {
                slaService.recordResponse(job.getSla(), now);
            }
        } else if (targetStatus == JobStatus.CANCELLED) {
            if (transitionDto.getNotes() != null) {
                job.setCompletionNotes("CANCELLED: " + transitionDto.getNotes());
            }
            // Release any reserved inventory parts back to available stock
            inventoryService.releasePartsForJob(job.getId(), caller);

            // Free technician workload
            if (job.getAssignedTechnician() != null) {
                Technician tech = job.getAssignedTechnician();
                tech.setActiveJobsCount(Math.max(0, tech.getActiveJobsCount() - 1));
                if (tech.getStatus() == TechnicianStatus.ON_JOB) {
                    tech.setStatus(TechnicianStatus.AVAILABLE);
                }
            }
        }

        job.setStatus(targetStatus);
        Job saved = jobRepository.save(job);

        // Record Audit Event
        auditService.logEvent(
                "Job",
                saved.getId(),
                auditAction,
                caller,
                currentStatus.name(),
                targetStatus.name(),
                Map.of("notes", transitionDto.getNotes() != null ? transitionDto.getNotes() : "", "timestamp", now.toString())
        );

        return mapToDto(saved);
    }

    private AuditAction determineAuditAction(JobStatus targetStatus) {
        return switch (targetStatus) {
            case TRIAGED -> AuditAction.JOB_TRIAGED;
            case ASSIGNED -> AuditAction.JOB_ASSIGNED;
            case ACCEPTED -> AuditAction.TECHNICIAN_ACCEPTED;
            case IN_PROGRESS -> AuditAction.JOB_STARTED;
            case COMPLETED -> AuditAction.JOB_COMPLETED;
            case CANCELLED -> AuditAction.JOB_CANCELLED;
            default -> AuditAction.JOB_CREATED;
        };
    }

    private JobSummaryDto mapToSummaryDto(Job job) {
        String techName = null;
        Long techId = null;
        if (job.getAssignedTechnician() != null) {
            techId = job.getAssignedTechnician().getId();
            techName = (job.getAssignedTechnician().getUser() != null)
                    ? job.getAssignedTechnician().getUser().getFirstName() + " " + job.getAssignedTechnician().getUser().getLastName()
                    : job.getAssignedTechnician().getEmployeeCode();
        }

        SlaRiskLevel riskLevel = SlaRiskLevel.HEALTHY;
        Instant resolutionDeadline = null;
        if (job.getSla() != null) {
            riskLevel = job.getSla().getRiskLevel();
            resolutionDeadline = job.getSla().getResolutionDeadline();
        }

        return JobSummaryDto.builder()
                .id(job.getId())
                .jobNumber(job.getJobNumber())
                .priority(job.getPriority())
                .status(job.getStatus())
                .address(job.getAddress())
                .latitude(job.getLatitude())
                .longitude(job.getLongitude())
                .estimatedDurationMinutes(job.getEstimatedDurationMinutes())
                .assignedTechnicianId(techId)
                .assignedTechnicianName(techName)
                .slaRiskLevel(riskLevel)
                .resolutionDeadline(resolutionDeadline)
                .createdAt(job.getCreatedAt())
                .build();
    }

    private JobDto mapToDto(Job job) {
        Long serviceRequestId = (job.getServiceRequest() != null) ? job.getServiceRequest().getId() : null;

        TechnicianSummaryDto techDto = null;
        if (job.getAssignedTechnician() != null) {
            Technician t = job.getAssignedTechnician();
            String name = (t.getUser() != null)
                    ? t.getUser().getFirstName() + " " + t.getUser().getLastName()
                    : t.getEmployeeCode();

            techDto = TechnicianSummaryDto.builder()
                    .id(t.getId())
                    .fullName(name)
                    .employeeCode(t.getEmployeeCode())
                    .status(t.getStatus())
                    .activeJobsCount(t.getActiveJobsCount())
                    .maxConcurrentJobs(t.getMaxConcurrentJobs())
                    .rating(t.getRating())
                    .currentLatitude(t.getCurrentLatitude())
                    .currentLongitude(t.getCurrentLongitude())
                    .build();
        }

        Set<SkillDto> skillDtos = job.getRequiredSkills().stream()
                .map(s -> SkillDto.builder()
                        .id(s.getId())
                        .code(s.getCode())
                        .name(s.getName())
                        .category(s.getCategory())
                        .certificationLevel(s.getCertificationLevel())
                        .description(s.getDescription())
                        .build())
                .collect(Collectors.toSet());

        SlaDto slaDto = null;
        if (job.getSla() != null) {
            Sla s = job.getSla();
            slaDto = SlaDto.builder()
                    .id(s.getId())
                    .jobId(job.getId())
                    .responseDeadline(s.getResponseDeadline())
                    .resolutionDeadline(s.getResolutionDeadline())
                    .respondedAt(s.getRespondedAt())
                    .resolvedAt(s.getResolvedAt())
                    .riskLevel(s.getRiskLevel())
                    .breachReason(s.getBreachReason())
                    .build();
        }

        List<JobPartDto> partDtos = job.getParts().stream()
                .map(p -> JobPartDto.builder()
                        .id(p.getId())
                        .inventoryItemId(p.getInventoryItem().getId())
                        .sku(p.getInventoryItem().getSku())
                        .partName(p.getInventoryItem().getName())
                        .quantityRequired(p.getQuantityRequired())
                        .status(p.getStatus())
                        .reservedAt(p.getReservedAt())
                        .consumedAt(p.getConsumedAt())
                        .build())
                .toList();

        return JobDto.builder()
                .id(job.getId())
                .jobNumber(job.getJobNumber())
                .serviceRequestId(serviceRequestId)
                .priority(job.getPriority())
                .status(job.getStatus())
                .address(job.getAddress())
                .latitude(job.getLatitude())
                .longitude(job.getLongitude())
                .estimatedDurationMinutes(job.getEstimatedDurationMinutes())
                .scheduledStartTime(job.getScheduledStartTime())
                .actualStartTime(job.getActualStartTime())
                .completedAt(job.getCompletedAt())
                .completionNotes(job.getCompletionNotes())
                .assignedTechnician(techDto)
                .requiredSkills(skillDtos)
                .sla(slaDto)
                .parts(partDtos)
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .build();
    }
}
