package com.opsflow.service.impl;

import com.opsflow.domain.entity.ServiceRequest;
import com.opsflow.domain.enums.JobPriority;
import com.opsflow.dto.CreateServiceRequestDto;
import com.opsflow.dto.ServiceRequestDto;
import com.opsflow.exception.ResourceNotFoundException;
import com.opsflow.repository.ServiceRequestRepository;
import com.opsflow.service.ServiceRequestService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ServiceRequestServiceImpl implements ServiceRequestService {

    private final ServiceRequestRepository requestRepository;

    public ServiceRequestServiceImpl(ServiceRequestRepository requestRepository) {
        this.requestRepository = requestRepository;
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
