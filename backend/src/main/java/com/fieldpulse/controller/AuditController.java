package com.fieldpulse.controller;

import com.fieldpulse.dto.common.ApiResponse;
import com.fieldpulse.dto.triage.AuditEventDto;
import com.fieldpulse.service.AuditService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/audit")
@Tag(name = "Audit", description = "System-wide immutable audit trail endpoints")
public class AuditController {

    private final AuditService auditService;

    public AuditController(AuditService auditService) {
        this.auditService = auditService;
    }

    @GetMapping("/{entityName}/{entityId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DISPATCHER')")
    @Operation(summary = "Get entity audit trail", description = "Retrieves chronological audit events and snapshot diffs for any entity.")
    public ResponseEntity<ApiResponse<List<AuditEventDto>>> getAuditTrail(
            @PathVariable String entityName,
            @PathVariable Long entityId) {
        List<AuditEventDto> auditTrail = auditService.getAuditTrail(entityName, entityId);
        return ResponseEntity.ok(ApiResponse.ok(auditTrail));
    }
}
