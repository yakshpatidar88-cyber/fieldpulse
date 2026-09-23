package com.fieldpulse.service;

import com.fieldpulse.domain.entity.User;
import com.fieldpulse.domain.enums.JobPriority;
import com.fieldpulse.dto.CreateServiceRequestDto;
import com.fieldpulse.dto.JobDto;
import com.fieldpulse.dto.ServiceRequestDto;
import com.fieldpulse.dto.triage.TriageServiceRequestDto;

import java.util.List;

public interface ServiceRequestService {
    ServiceRequestDto createRequest(CreateServiceRequestDto dto);
    ServiceRequestDto getRequestById(Long id);
    List<ServiceRequestDto> getAllRequests(String status, JobPriority priority);
    JobDto triageAndConvertToJob(Long requestId, TriageServiceRequestDto triageDto, User caller);
}
