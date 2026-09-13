package com.opsflow.service;

import com.opsflow.domain.entity.User;
import com.opsflow.domain.enums.JobPriority;
import com.opsflow.dto.CreateServiceRequestDto;
import com.opsflow.dto.JobDto;
import com.opsflow.dto.ServiceRequestDto;
import com.opsflow.dto.triage.TriageServiceRequestDto;

import java.util.List;

public interface ServiceRequestService {
    ServiceRequestDto createRequest(CreateServiceRequestDto dto);
    ServiceRequestDto getRequestById(Long id);
    List<ServiceRequestDto> getAllRequests(String status, JobPriority priority);
    JobDto triageAndConvertToJob(Long requestId, TriageServiceRequestDto triageDto, User caller);
}
