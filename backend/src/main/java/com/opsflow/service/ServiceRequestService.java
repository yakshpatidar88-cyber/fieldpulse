package com.opsflow.service;

import com.opsflow.domain.enums.JobPriority;
import com.opsflow.dto.CreateServiceRequestDto;
import com.opsflow.dto.ServiceRequestDto;

import java.util.List;

public interface ServiceRequestService {
    ServiceRequestDto createRequest(CreateServiceRequestDto dto);
    ServiceRequestDto getRequestById(Long id);
    List<ServiceRequestDto> getAllRequests(String status, JobPriority priority);
}
