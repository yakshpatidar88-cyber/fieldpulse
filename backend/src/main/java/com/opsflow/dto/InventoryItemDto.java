package com.opsflow.dto;

import java.math.BigDecimal;

public class InventoryItemDto {
    private Long id;
    private String sku;
    private String name;
    private String description;
    private String category;
    private BigDecimal unitPrice;
    private Integer quantityAvailable;
    private Integer quantityReserved;
    private Integer minimumThreshold;
    private String warehouseLocation;
    private boolean lowStock;

    public InventoryItemDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public Integer getQuantityAvailable() { return quantityAvailable; }
    public void setQuantityAvailable(Integer quantityAvailable) { this.quantityAvailable = quantityAvailable; }

    public Integer getQuantityReserved() { return quantityReserved; }
    public void setQuantityReserved(Integer quantityReserved) { this.quantityReserved = quantityReserved; }

    public Integer getMinimumThreshold() { return minimumThreshold; }
    public void setMinimumThreshold(Integer minimumThreshold) { this.minimumThreshold = minimumThreshold; }

    public String getWarehouseLocation() { return warehouseLocation; }
    public void setWarehouseLocation(String warehouseLocation) { this.warehouseLocation = warehouseLocation; }

    public boolean isLowStock() { return lowStock; }
    public void setLowStock(boolean lowStock) { this.lowStock = lowStock; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final InventoryItemDto dto = new InventoryItemDto();

        public Builder id(Long id) { dto.setId(id); return this; }
        public Builder sku(String sku) { dto.setSku(sku); return this; }
        public Builder name(String name) { dto.setName(name); return this; }
        public Builder description(String desc) { dto.setDescription(desc); return this; }
        public Builder category(String category) { dto.setCategory(category); return this; }
        public Builder unitPrice(BigDecimal price) { dto.setUnitPrice(price); return this; }
        public Builder quantityAvailable(Integer qty) { dto.setQuantityAvailable(qty); return this; }
        public Builder quantityReserved(Integer qty) { dto.setQuantityReserved(qty); return this; }
        public Builder minimumThreshold(Integer min) { dto.setMinimumThreshold(min); return this; }
        public Builder warehouseLocation(String loc) { dto.setWarehouseLocation(loc); return this; }
        public Builder lowStock(boolean low) { dto.setLowStock(low); return this; }
        public InventoryItemDto build() { return dto; }
    }
}
