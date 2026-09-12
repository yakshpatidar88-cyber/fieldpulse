package com.opsflow.service.impl;

import com.opsflow.domain.entity.*;
import com.opsflow.domain.enums.JobPriority;
import com.opsflow.domain.enums.JobStatus;
import com.opsflow.domain.enums.SlaRiskLevel;
import com.opsflow.dto.*;
import com.opsflow.exception.ResourceNotFoundException;
import com.opsflow.repository.JobRepository;
import com.opsflow.service.JobService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;

    public JobServiceImpl(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
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
