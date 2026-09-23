package com.fieldpulse.controller;

import com.fieldpulse.domain.enums.TechnicianStatus;
import com.fieldpulse.dto.TechnicianDto;
import com.fieldpulse.dto.TechnicianStatusUpdateDto;
import com.fieldpulse.dto.TechnicianSummaryDto;
import com.fieldpulse.dto.common.ApiResponse;
import com.fieldpulse.service.TechnicianService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/technicians")
@Tag(name = "Technicians", description = "Technician profiles, status updates, and live coordinates")
public class TechnicianController {

    private final TechnicianService technicianService;

    public TechnicianController(TechnicianService technicianService) {
        this.technicianService = technicianService;
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get technician profile by ID", description = "Retrieves complete technician profile including certified skills.")
    public ResponseEntity<ApiResponse<TechnicianDto>> getTechnicianById(@PathVariable Long id) {
        TechnicianDto dto = technicianService.getTechnicianById(id);
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @GetMapping
    @Operation(summary = "List technicians", description = "Returns list of technicians with optional status filter.")
    public ResponseEntity<ApiResponse<List<TechnicianSummaryDto>>> getAllTechnicians(
            @RequestParam(required = false) TechnicianStatus status) {
        List<TechnicianSummaryDto> list = technicianService.getAllTechnicians(status);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/available")
    @Operation(summary = "List currently available technicians", description = "Returns active technicians who have spare concurrency capacity.")
    public ResponseEntity<ApiResponse<List<TechnicianSummaryDto>>> getAvailableTechnicians() {
        List<TechnicianSummaryDto> list = technicianService.getAvailableTechnicians();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update technician shift status and coordinates", description = "Updates shift status and current GPS location coordinates.")
    public ResponseEntity<ApiResponse<TechnicianDto>> updateTechnicianStatus(
            @PathVariable Long id,
            @Valid @RequestBody TechnicianStatusUpdateDto dto) {
        TechnicianDto updated = technicianService.updateTechnicianStatus(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Technician status updated successfully", updated));
    }
}
