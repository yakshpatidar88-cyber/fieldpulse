package com.opsflow.controller;

import com.opsflow.domain.entity.User;
import com.opsflow.domain.enums.JobPriority;
import com.opsflow.domain.enums.JobStatus;
import com.opsflow.dto.JobDto;
import com.opsflow.dto.JobSummaryDto;
import com.opsflow.dto.common.ApiResponse;
import com.opsflow.dto.triage.AuditEventDto;
import com.opsflow.dto.triage.JobStatusTransitionDto;
import com.opsflow.repository.UserRepository;
import com.opsflow.service.AuditService;
import com.opsflow.service.JobService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobs")
@Tag(name = "Jobs", description = "Field service job lifecycle management and queries")
public class JobController {

    private final JobService jobService;
    private final AuditService auditService;
    private final UserRepository userRepository;

    public JobController(JobService jobService, AuditService auditService, UserRepository userRepository) {
        this.jobService = jobService;
        this.auditService = auditService;
        this.userRepository = userRepository;
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get job by ID", description = "Retrieves complete job details including assigned technician, required skills, and parts reservations.")
    public ResponseEntity<ApiResponse<JobDto>> getJobById(@PathVariable Long id) {
        JobDto dto = jobService.getJobById(id);
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @GetMapping("/number/{jobNumber}")
    @Operation(summary = "Get job by human-readable job number", description = "Retrieves complete job by unique job number string (e.g. JOB-2026-0001).")
    public ResponseEntity<ApiResponse<JobDto>> getJobByJobNumber(@PathVariable String jobNumber) {
        JobDto dto = jobService.getJobByJobNumber(jobNumber);
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @GetMapping
    @Operation(summary = "List and filter jobs", description = "Returns list of jobs with optional status and priority filters.")
    public ResponseEntity<ApiResponse<List<JobSummaryDto>>> getAllJobs(
            @RequestParam(required = false) JobStatus status,
            @RequestParam(required = false) JobPriority priority) {
        List<JobSummaryDto> list = jobService.getAllJobs(status, priority);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/technician/{technicianId}/active")
    @Operation(summary = "Get active jobs for technician", description = "Returns active assigned or in-progress jobs for a specific technician.")
    public ResponseEntity<ApiResponse<List<JobSummaryDto>>> getActiveJobsForTechnician(@PathVariable Long technicianId) {
        List<JobSummaryDto> list = jobService.getActiveJobsForTechnician(technicianId);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Transition job status", description = "Executes an SLA-tracked state machine status transition on a job with reason, notes, and audit logging.")
    public ResponseEntity<ApiResponse<JobDto>> transitionJobStatus(
            @PathVariable Long id,
            @Valid @RequestBody JobStatusTransitionDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        User caller = (userDetails != null)
                ? userRepository.findByEmail(userDetails.getUsername()).orElse(null)
                : null;
        JobDto result = jobService.transitionJobStatus(id, dto, caller);
        return ResponseEntity.ok(ApiResponse.ok("Job status transitioned successfully", result));
    }

    @GetMapping("/{id}/audit-trail")
    @Operation(summary = "Get audit trail for job", description = "Retrieves complete chronological audit history and state diffs for a job.")
    public ResponseEntity<ApiResponse<List<AuditEventDto>>> getJobAuditTrail(@PathVariable Long id) {
        List<AuditEventDto> trail = auditService.getAuditTrail("Job", id);
        return ResponseEntity.ok(ApiResponse.ok(trail));
    }
}
