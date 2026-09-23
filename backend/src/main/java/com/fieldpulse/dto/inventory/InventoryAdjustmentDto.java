package com.fieldpulse.dto.inventory;

import jakarta.validation.constraints.NotNull;

public class InventoryAdjustmentDto {

    @NotNull(message = "Inventory item ID is required")
    private Long itemId;

    @NotNull(message = "Quantity change is required")
    private Integer quantityChange;

    private String reason;
    private String warehouseLocation;

    public InventoryAdjustmentDto() {}

    public InventoryAdjustmentDto(Long itemId, Integer quantityChange, String reason, String warehouseLocation) {
        this.itemId = itemId;
        this.quantityChange = quantityChange;
        this.reason = reason;
        this.warehouseLocation = warehouseLocation;
    }

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public Integer getQuantityChange() { return quantityChange; }
    public void setQuantityChange(Integer quantityChange) { this.quantityChange = quantityChange; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getWarehouseLocation() { return warehouseLocation; }
    public void setWarehouseLocation(String warehouseLocation) { this.warehouseLocation = warehouseLocation; }
}
