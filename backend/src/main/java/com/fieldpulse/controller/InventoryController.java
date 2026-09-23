package com.fieldpulse.controller;

import com.fieldpulse.domain.entity.User;
import com.fieldpulse.dto.InventoryItemDto;
import com.fieldpulse.dto.common.ApiResponse;
import com.fieldpulse.dto.inventory.InventoryAdjustmentDto;
import com.fieldpulse.dto.inventory.JobPartStatusDto;
import com.fieldpulse.dto.inventory.LowStockAlertDto;
import com.fieldpulse.repository.UserRepository;
import com.fieldpulse.service.InventoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventory")
@Tag(name = "Inventory", description = "Parts catalog, transactional inventory reservation, and low-stock alerts")
public class InventoryController {

    private final InventoryService inventoryService;
    private final UserRepository userRepository;

    public InventoryController(InventoryService inventoryService, UserRepository userRepository) {
        this.inventoryService = inventoryService;
        this.userRepository = userRepository;
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get inventory item by ID", description = "Retrieves stock and warehouse details for a specific part.")
    public ResponseEntity<ApiResponse<InventoryItemDto>> getItemById(@PathVariable Long id) {
        InventoryItemDto dto = inventoryService.getItemById(id);
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @GetMapping("/sku/{sku}")
    @Operation(summary = "Get inventory item by SKU", description = "Looks up part by unique SKU.")
    public ResponseEntity<ApiResponse<InventoryItemDto>> getItemBySku(@PathVariable String sku) {
        InventoryItemDto dto = inventoryService.getItemBySku(sku);
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @GetMapping
    @Operation(summary = "List inventory items", description = "Lists inventory items with optional category filter.")
    public ResponseEntity<ApiResponse<List<InventoryItemDto>>> getAllItems(
            @RequestParam(required = false) String category) {
        List<InventoryItemDto> list = inventoryService.getAllItems(category);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/low-stock")
    @Operation(summary = "List low stock inventory items", description = "Returns parts whose available stock is at or below minimum safety threshold.")
    public ResponseEntity<ApiResponse<List<InventoryItemDto>>> getLowStockItems() {
        List<InventoryItemDto> list = inventoryService.getLowStockItems();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/low-stock/alerts")
    @Operation(summary = "Get detailed low-stock alerts", description = "Returns parts with deficit calculations for replenishment.")
    public ResponseEntity<ApiResponse<List<LowStockAlertDto>>> getLowStockAlerts() {
        List<LowStockAlertDto> list = inventoryService.getLowStockAlerts();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PostMapping("/adjust")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DISPATCHER')")
    @Operation(summary = "Adjust inventory stock", description = "Restocks or makes manual adjustments to inventory with pessimistic write locking.")
    public ResponseEntity<ApiResponse<InventoryItemDto>> adjustStock(
            @Valid @RequestBody InventoryAdjustmentDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        User caller = (userDetails != null)
                ? userRepository.findByEmail(userDetails.getUsername()).orElse(null)
                : null;
        InventoryItemDto result = inventoryService.adjustStock(dto, caller);
        return ResponseEntity.ok(ApiResponse.ok("Inventory stock adjusted successfully", result));
    }

    @PostMapping("/jobs/{jobId}/reserve")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DISPATCHER')")
    @Operation(summary = "Reserve parts for job", description = "Locks and reserves all required parts for a field service job.")
    public ResponseEntity<ApiResponse<List<JobPartStatusDto>>> reservePartsForJob(
            @PathVariable Long jobId,
            @AuthenticationPrincipal UserDetails userDetails) {
        User caller = (userDetails != null)
                ? userRepository.findByEmail(userDetails.getUsername()).orElse(null)
                : null;
        List<JobPartStatusDto> result = inventoryService.reservePartsForJob(jobId, caller);
        return ResponseEntity.ok(ApiResponse.ok("Parts reserved successfully", result));
    }

    @PostMapping("/jobs/{jobId}/release")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DISPATCHER')")
    @Operation(summary = "Release parts for job", description = "Releases reserved parts back to available stock for a job.")
    public ResponseEntity<ApiResponse<List<JobPartStatusDto>>> releasePartsForJob(
            @PathVariable Long jobId,
            @AuthenticationPrincipal UserDetails userDetails) {
        User caller = (userDetails != null)
                ? userRepository.findByEmail(userDetails.getUsername()).orElse(null)
                : null;
        List<JobPartStatusDto> result = inventoryService.releasePartsForJob(jobId, caller);
        return ResponseEntity.ok(ApiResponse.ok("Parts released successfully", result));
    }

    @GetMapping("/jobs/{jobId}/parts")
    @Operation(summary = "Get parts for job", description = "Retrieves part requirements and reservation status for a job.")
    public ResponseEntity<ApiResponse<List<JobPartStatusDto>>> getPartsForJob(@PathVariable Long jobId) {
        List<JobPartStatusDto> list = inventoryService.getPartsForJob(jobId);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }
}
