package com.opsflow.controller;

import com.opsflow.dto.SlaDto;
import com.opsflow.dto.common.ApiResponse;
import com.opsflow.dto.notification.SlaDashboardMetricsDto;
import com.opsflow.dto.notification.SlaEscalationSummaryDto;
import com.opsflow.service.SlaEscalationEngine;
import com.opsflow.service.SlaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sla")
@Tag(name = "SLA & Escalations", description = "SLA tracking, compliance dashboard metrics, and escalation monitoring")
public class SlaController {

    private final SlaService slaService;
    private final SlaEscalationEngine escalationEngine;

    public SlaController(SlaService slaService, SlaEscalationEngine escalationEngine) {
        this.slaService = slaService;
        this.escalationEngine = escalationEngine;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get SLA operations dashboard metrics",
               description = "Calculates total active jobs, healthy/warning/breached SLA breakdown, and current compliance rate.")
    public ResponseEntity<ApiResponse<SlaDashboardMetricsDto>> getDashboardMetrics() {
        SlaDashboardMetricsDto metrics = escalationEngine.getDashboardMetrics();
        return ResponseEntity.ok(ApiResponse.ok(metrics));
    }

    @PostMapping("/monitor/run")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DISPATCHER')")
    @Operation(summary = "Trigger on-demand SLA escalation scan",
               description = "Manually triggers background SLA evaluation, escalating risk tiers and broadcasting notifications.")
    public ResponseEntity<ApiResponse<SlaEscalationSummaryDto>> runManualScan() {
        SlaEscalationSummaryDto summary = escalationEngine.evaluateAndEscalateActiveSlas();
        return ResponseEntity.ok(ApiResponse.ok("SLA monitoring scan completed", summary));
    }

    @GetMapping("/job/{jobId}")
    @Operation(summary = "Get SLA details for specific job",
               description = "Retrieves response deadline, resolution deadline, risk level, and response/resolution timestamps.")
    public ResponseEntity<ApiResponse<SlaDto>> getSlaByJobId(@PathVariable Long jobId) {
        SlaDto dto = slaService.getSlaByJobId(jobId);
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }
}
