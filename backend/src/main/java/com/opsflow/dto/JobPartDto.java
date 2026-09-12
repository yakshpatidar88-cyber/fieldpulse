package com.opsflow.dto;

import com.opsflow.domain.enums.PartReservationStatus;
import java.time.Instant;

public class JobPartDto {
    private Long id;
    private Long inventoryItemId;
    private String sku;
    private String partName;
    private Integer quantityRequired;
    private PartReservationStatus status;
    private Instant reservedAt;
    private Instant consumedAt;

    public JobPartDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getInventoryItemId() { return inventoryItemId; }
    public void setInventoryItemId(Long inventoryItemId) { this.inventoryItemId = inventoryItemId; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getPartName() { return partName; }
    public void setPartName(String partName) { this.partName = partName; }

    public Integer getQuantityRequired() { return quantityRequired; }
    public void setQuantityRequired(Integer quantityRequired) { this.quantityRequired = quantityRequired; }

    public PartReservationStatus getStatus() { return status; }
    public void setStatus(PartReservationStatus status) { this.status = status; }

    public Instant getReservedAt() { return reservedAt; }
    public void setReservedAt(Instant reservedAt) { this.reservedAt = reservedAt; }

    public Instant getConsumedAt() { return consumedAt; }
    public void setConsumedAt(Instant consumedAt) { this.consumedAt = consumedAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final JobPartDto dto = new JobPartDto();

        public Builder id(Long id) { dto.setId(id); return this; }
        public Builder inventoryItemId(Long id) { dto.setInventoryItemId(id); return this; }
        public Builder sku(String sku) { dto.setSku(sku); return this; }
        public Builder partName(String name) { dto.setPartName(name); return this; }
        public Builder quantityRequired(Integer qty) { dto.setQuantityRequired(qty); return this; }
        public Builder status(PartReservationStatus status) { dto.setStatus(status); return this; }
        public Builder reservedAt(Instant reservedAt) { dto.setReservedAt(reservedAt); return this; }
        public Builder consumedAt(Instant consumedAt) { dto.setConsumedAt(consumedAt); return this; }
        public JobPartDto build() { return dto; }
    }
}
