package com.opsflow.controller;

import com.opsflow.domain.entity.User;
import com.opsflow.dto.common.ApiResponse;
import com.opsflow.dto.dispatch.AssignmentDto;
import com.opsflow.dto.dispatch.ConfirmAssignmentDto;
import com.opsflow.dto.dispatch.DispatchRecommendationResponseDto;
import com.opsflow.repository.UserRepository;
import com.opsflow.service.DispatchService;
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
@RequestMapping("/dispatch")
@Tag(name = "Dispatch", description = "Technician dispatch optimization, candidate ranking, and assignment confirmation")
public class DispatchController {

    private final DispatchService dispatchService;
    private final UserRepository userRepository;

    public DispatchController(DispatchService dispatchService, UserRepository userRepository) {
        this.dispatchService = dispatchService;
        this.userRepository = userRepository;
    }

    @GetMapping("/recommendations")
    @PreAuthorize("hasRole('DISPATCHER') or hasRole('ADMIN')")
    @Operation(summary = "Get ranked technician recommendations for a job",
               description = "Computes multi-factor scores (skills, Haversine distance, workload balance, and SLA urgency) for active technicians and ranks them descending by match quality.")
    public ResponseEntity<ApiResponse<DispatchRecommendationResponseDto>> getRecommendations(
            @RequestParam Long jobId,
            @RequestParam(required = false) Double maxDistanceKm) {
        DispatchRecommendationResponseDto response = dispatchService.getRecommendations(jobId, maxDistanceKm);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/assign")
    @PreAuthorize("hasRole('DISPATCHER') or hasRole('ADMIN')")
    @Operation(summary = "Confirm technician assignment to job",
               description = "Assigns an evaluated technician to a job, transitions status to ASSIGNED, increments technician active workload, and logs immutable audit trail.")
    public ResponseEntity<ApiResponse<AssignmentDto>> confirmAssignment(
            @Valid @RequestBody ConfirmAssignmentDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        User caller = (userDetails != null)
                ? userRepository.findByEmail(userDetails.getUsername()).orElse(null)
                : null;

        AssignmentDto assignment = dispatchService.confirmAssignment(dto, caller);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Technician assignment confirmed successfully", assignment));
    }

    @GetMapping("/technicians/{technicianId}/assignments")
    @PreAuthorize("hasRole('DISPATCHER') or hasRole('ADMIN') or hasRole('TECHNICIAN')")
    @Operation(summary = "Get assignments for technician",
               description = "Lists all historical and current job assignments for a specific technician.")
    public ResponseEntity<ApiResponse<List<AssignmentDto>>> getAssignmentsForTechnician(@PathVariable Long technicianId) {
        List<AssignmentDto> list = dispatchService.getAssignmentsForTechnician(technicianId);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/jobs/{jobId}/assignments")
    @PreAuthorize("hasRole('DISPATCHER') or hasRole('ADMIN')")
    @Operation(summary = "Get assignment history for job",
               description = "Lists all dispatch attempts, offers, and assignments made for a specific job.")
    public ResponseEntity<ApiResponse<List<AssignmentDto>>> getAssignmentsForJob(@PathVariable Long jobId) {
        List<AssignmentDto> list = dispatchService.getAssignmentsForJob(jobId);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }
}
