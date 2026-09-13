package com.opsflow.service.impl;

import com.opsflow.domain.entity.*;
import com.opsflow.domain.enums.AuditAction;
import com.opsflow.domain.enums.JobPriority;
import com.opsflow.domain.enums.JobStatus;
import com.opsflow.domain.enums.PartReservationStatus;
import com.opsflow.dto.CreateServiceRequestDto;
import com.opsflow.dto.JobDto;
import com.opsflow.dto.ServiceRequestDto;
import com.opsflow.dto.triage.JobPartRequirementDto;
import com.opsflow.dto.triage.TriageServiceRequestDto;
import com.opsflow.exception.BusinessValidationException;
import com.opsflow.exception.ResourceNotFoundException;
import com.opsflow.repository.*;
import com.opsflow.service.AuditService;
import com.opsflow.service.JobService;
import com.opsflow.service.ServiceRequestService;
import com.opsflow.service.SlaService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class ServiceRequestServiceImpl implements ServiceRequestService {

    private final ServiceRequestRepository requestRepository;
    private final JobRepository jobRepository;
    private final SkillRepository skillRepository;
    private final InventoryItemRepository inventoryRepository;
    private final JobPartRepository jobPartRepository;
    private final SlaService slaService;
    private final AuditService auditService;
    private final JobService jobService;

    public ServiceRequestServiceImpl(ServiceRequestRepository requestRepository,
                                     JobRepository jobRepository,
                                     SkillRepository skillRepository,
                                     InventoryItemRepository inventoryRepository,
                                     JobPartRepository jobPartRepository,
                                     SlaService slaService,
                                     AuditService auditService,
                                     JobService jobService) {
        this.requestRepository = requestRepository;
        this.jobRepository = jobRepository;
        this.skillRepository = skillRepository;
        this.inventoryRepository = inventoryRepository;
        this.jobPartRepository = jobPartRepository;
        this.slaService = slaService;
        this.auditService = auditService;
        this.jobService = jobService;
    }

    @Override
    @Transactional
    public ServiceRequestDto createRequest(CreateServiceRequestDto dto) {
        ServiceRequest entity = new ServiceRequest();
        entity.setCustomerName(dto.getCustomerName());
        entity.setCustomerEmail(dto.getCustomerEmail());
        entity.setCustomerPhone(dto.getCustomerPhone());
        entity.setAddress(dto.getAddress());
        entity.setLatitude(dto.getLatitude());
        entity.setLongitude(dto.getLongitude());
        entity.setDescription(dto.getDescription());
        entity.setPriority(dto.getPriority() != null ? dto.getPriority() : JobPriority.MEDIUM);
        entity.setStatus("RECEIVED");

        ServiceRequest saved = requestRepository.save(entity);

        auditService.logEvent(
                "ServiceRequest",
                saved.getId(),
                AuditAction.SERVICE_REQUEST_CREATED,
                null,
                null,
                saved.getStatus(),
                Map.of("customer", saved.getCustomerName(), "priority", saved.getPriority().name())
        );

        return mapToDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ServiceRequestDto getRequestById(Long id) {
        return requestRepository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new ResourceNotFoundException("ServiceRequest", "id", id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceRequestDto> getAllRequests(String status, JobPriority priority) {
        List<ServiceRequest> list;
        if (status != null && !status.isBlank()) {
            list = requestRepository.findByStatus(status);
        } else if (priority != null) {
            list = requestRepository.findByPriority(priority);
        } else {
            list = requestRepository.findAll();
        }
        return list.stream().map(this::mapToDto).toList();
    }

    @Override
    @Transactional
    public JobDto triageAndConvertToJob(Long requestId, TriageServiceRequestDto triageDto, User caller) {
        ServiceRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("ServiceRequest", "id", requestId));

        if (!"RECEIVED".equalsIgnoreCase(request.getStatus())) {
            throw new BusinessValidationException(
                    String.format("Cannot triage ServiceRequest #%d with status '%s'. Only 'RECEIVED' requests can be triaged.",
                            requestId, request.getStatus())
            );
        }

        // 1. Update ServiceRequest status
        request.setStatus("CONVERTED_TO_JOB");
        requestRepository.save(request);

        // 2. Resolve Required Skills
        Set<Skill> skills = new HashSet<>();
        if (triageDto.getRequiredSkillIds() != null && !triageDto.getRequiredSkillIds().isEmpty()) {
            skills.addAll(skillRepository.findAllById(triageDto.getRequiredSkillIds()));
        }

        // 3. Generate Unique Job Number
        String jobNumber = generateJobNumber();

        // 4. Create Job entity in TRIAGED state
        Job job = new Job();
        job.setJobNumber(jobNumber);
        job.setServiceRequest(request);
        job.setPriority(triageDto.getPriority());
        job.setStatus(JobStatus.TRIAGED);
        job.setAddress(request.getAddress());
        job.setLatitude(request.getLatitude());
        job.setLongitude(request.getLongitude());
        job.setEstimatedDurationMinutes(triageDto.getEstimatedDurationMinutes());
        job.setScheduledStartTime(triageDto.getScheduledStartTime());
        job.setRequiredSkills(skills);

        Job savedJob = jobRepository.save(job);

        // 5. Attach Required Parts if specified
        if (triageDto.getRequiredParts() != null) {
            for (JobPartRequirementDto partReq : triageDto.getRequiredParts()) {
                InventoryItem item = inventoryRepository.findById(partReq.getInventoryItemId())
                        .orElseThrow(() -> new ResourceNotFoundException("InventoryItem", "id", partReq.getInventoryItemId()));

                JobPart jobPart = new JobPart();
                jobPart.setJob(savedJob);
                jobPart.setInventoryItem(item);
                jobPart.setQuantityRequired(partReq.getQuantity());
                jobPart.setStatus(PartReservationStatus.REQUESTED);
                jobPartRepository.save(jobPart);
            }
        }

        // 6. Compute and Save Dynamic SLA
        Sla sla = slaService.createSlaForJob(savedJob);
        savedJob.setSla(sla);

        // 7. Record Immutable Audit Events
        auditService.logEvent(
                "ServiceRequest",
                request.getId(),
                AuditAction.SERVICE_REQUEST_TRIAGED,
                caller,
                "RECEIVED",
                "CONVERTED_TO_JOB",
                Map.of("convertedToJobNumber", jobNumber)
        );

        auditService.logEvent(
                "Job",
                savedJob.getId(),
                AuditAction.JOB_CREATED,
                caller,
                null,
                JobStatus.CREATED.name(),
                Map.of("sourceRequestId", request.getId())
        );

        auditService.logEvent(
                "Job",
                savedJob.getId(),
                AuditAction.JOB_TRIAGED,
                caller,
                JobStatus.CREATED.name(),
                JobStatus.TRIAGED.name(),
                Map.of(
                        "priority", savedJob.getPriority().name(),
                        "estimatedDurationMinutes", savedJob.getEstimatedDurationMinutes(),
                        "requiredSkillsCount", skills.size()
                )
        );

        return jobService.getJobById(savedJob.getId());
    }

    private String generateJobNumber() {
        long count = jobRepository.count() + 1;
        return String.format("JOB-2026-%04d", count);
    }

    private ServiceRequestDto mapToDto(ServiceRequest entity) {
        return ServiceRequestDto.builder()
                .id(entity.getId())
                .customerName(entity.getCustomerName())
                .customerEmail(entity.getCustomerEmail())
                .customerPhone(entity.getCustomerPhone())
                .address(entity.getAddress())
                .latitude(entity.getLatitude())
                .longitude(entity.getLongitude())
                .description(entity.getDescription())
                .priority(entity.getPriority())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
