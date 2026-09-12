package com.opsflow.controller;

import com.opsflow.dto.InventoryItemDto;
import com.opsflow.dto.common.ApiResponse;
import com.opsflow.service.InventoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventory")
@Tag(name = "Inventory", description = "Parts catalog, inventory tracking, and low-stock alerts")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
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
}
