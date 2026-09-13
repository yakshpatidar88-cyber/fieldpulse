package com.opsflow.controller;

import com.opsflow.domain.entity.User;
import com.opsflow.domain.enums.JobPriority;
import com.opsflow.dto.CreateServiceRequestDto;
import com.opsflow.dto.JobDto;
import com.opsflow.dto.ServiceRequestDto;
import com.opsflow.dto.common.ApiResponse;
import com.opsflow.dto.triage.TriageServiceRequestDto;
import com.opsflow.repository.UserRepository;
import com.opsflow.service.ServiceRequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/requests")
@Tag(name = "Service Requests", description = "Customer service request intake and triage endpoints")
public class ServiceRequestController {

    private final ServiceRequestService requestService;
    private final UserRepository userRepository;

    public ServiceRequestController(ServiceRequestService requestService, UserRepository userRepository) {
        this.requestService = requestService;
        this.userRepository = userRepository;
    }

    @PostMapping
    @Operation(summary = "Submit new service request", description = "Ingests a customer service request with address, geolocation, and priority.")
    public ResponseEntity<ApiResponse<ServiceRequestDto>> createRequest(@Valid @RequestBody CreateServiceRequestDto dto) {
        ServiceRequestDto created = requestService.createRequest(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Service request created successfully", created));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get service request by ID", description = "Retrieves details of a specific service request.")
    public ResponseEntity<ApiResponse<ServiceRequestDto>> getRequestById(@PathVariable Long id) {
        ServiceRequestDto dto = requestService.getRequestById(id);
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @GetMapping
    @Operation(summary = "List and filter service requests", description = "Lists service requests with optional filtering by status and priority.")
    public ResponseEntity<ApiResponse<List<ServiceRequestDto>>> getAllRequests(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) JobPriority priority) {
        List<ServiceRequestDto> list = requestService.getAllRequests(status, priority);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PostMapping("/{id}/triage")
    @PreAuthorize("hasRole('DISPATCHER') or hasRole('ADMIN')")
    @Operation(summary = "Triage request and convert to operational job", description = "Assigns required certified skills, estimated duration, parts, and computes SLA deadlines.")
    public ResponseEntity<ApiResponse<JobDto>> triageRequest(
            @PathVariable Long id,
            @Valid @RequestBody TriageServiceRequestDto triageDto,
            @AuthenticationPrincipal UserDetails userDetails) {

        User caller = (userDetails != null)
                ? userRepository.findByEmail(userDetails.getUsername()).orElse(null)
                : null;

        JobDto createdJob = requestService.triageAndConvertToJob(id, triageDto, caller);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Service request successfully triaged and converted to Job", createdJob));
    }
}
