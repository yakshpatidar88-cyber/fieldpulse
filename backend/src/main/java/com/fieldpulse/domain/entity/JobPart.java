package com.fieldpulse.domain.entity;

import com.fieldpulse.domain.enums.PartReservationStatus;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "job_parts")
public class JobPart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_item_id", nullable = false)
    private InventoryItem inventoryItem;

    @Column(name = "quantity_required", nullable = false)
    private Integer quantityRequired = 1;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PartReservationStatus status = PartReservationStatus.REQUESTED;

    @Column(name = "reserved_at")
    private Instant reservedAt;

    @Column(name = "consumed_at")
    private Instant consumedAt;

    public JobPart() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Job getJob() { return job; }
    public void setJob(Job job) { this.job = job; }

    public InventoryItem getInventoryItem() { return inventoryItem; }
    public void setInventoryItem(InventoryItem inventoryItem) { this.inventoryItem = inventoryItem; }

    public Integer getQuantityRequired() { return quantityRequired; }
    public void setQuantityRequired(Integer quantityRequired) { this.quantityRequired = quantityRequired; }

    public PartReservationStatus getStatus() { return status; }
    public void setStatus(PartReservationStatus status) { this.status = status; }

    public Instant getReservedAt() { return reservedAt; }
    public void setReservedAt(Instant reservedAt) { this.reservedAt = reservedAt; }

    public Instant getConsumedAt() { return consumedAt; }
    public void setConsumedAt(Instant consumedAt) { this.consumedAt = consumedAt; }
}
