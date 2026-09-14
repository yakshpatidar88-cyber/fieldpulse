package com.opsflow.dto.inventory;

import java.math.BigDecimal;

public class LowStockAlertDto {
    private Long itemId;
    private String sku;
    private String name;
    private String category;
    private Integer quantityAvailable;
    private Integer quantityReserved;
    private Integer minimumThreshold;
    private Integer deficit;
    private String warehouseLocation;
    private BigDecimal unitPrice;

    public LowStockAlertDto() {}

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getQuantityAvailable() { return quantityAvailable; }
    public void setQuantityAvailable(Integer quantityAvailable) { this.quantityAvailable = quantityAvailable; }

    public Integer getQuantityReserved() { return quantityReserved; }
    public void setQuantityReserved(Integer quantityReserved) { this.quantityReserved = quantityReserved; }

    public Integer getMinimumThreshold() { return minimumThreshold; }
    public void setMinimumThreshold(Integer minimumThreshold) { this.minimumThreshold = minimumThreshold; }

    public Integer getDeficit() { return deficit; }
    public void setDeficit(Integer deficit) { this.deficit = deficit; }

    public String getWarehouseLocation() { return warehouseLocation; }
    public void setWarehouseLocation(String warehouseLocation) { this.warehouseLocation = warehouseLocation; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
}
