package com.fieldpulse.dto.inventory;

import com.fieldpulse.domain.enums.PartReservationStatus;

import java.math.BigDecimal;
import java.time.Instant;

public class JobPartStatusDto {
    private Long jobPartId;
    private Long jobId;
    private String jobNumber;
    private Long inventoryItemId;
    private String sku;
    private String partName;
    private Integer quantityRequired;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
    private PartReservationStatus status;
    private Instant reservedAt;
    private Instant consumedAt;

    public JobPartStatusDto() {}

    public Long getJobPartId() { return jobPartId; }
    public void setJobPartId(Long jobPartId) { this.jobPartId = jobPartId; }

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public String getJobNumber() { return jobNumber; }
    public void setJobNumber(String jobNumber) { this.jobNumber = jobNumber; }

    public Long getInventoryItemId() { return inventoryItemId; }
    public void setInventoryItemId(Long inventoryItemId) { this.inventoryItemId = inventoryItemId; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getPartName() { return partName; }
    public void setPartName(String partName) { this.partName = partName; }

    public Integer getQuantityRequired() { return quantityRequired; }
    public void setQuantityRequired(Integer quantityRequired) { this.quantityRequired = quantityRequired; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

    public PartReservationStatus getStatus() { return status; }
    public void setStatus(PartReservationStatus status) { this.status = status; }

    public Instant getReservedAt() { return reservedAt; }
    public void setReservedAt(Instant reservedAt) { this.reservedAt = reservedAt; }

    public Instant getConsumedAt() { return consumedAt; }
    public void setConsumedAt(Instant consumedAt) { this.consumedAt = consumedAt; }
}
