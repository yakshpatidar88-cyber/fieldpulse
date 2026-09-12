package com.opsflow.domain.entity;

import com.opsflow.domain.enums.PartReservationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "job_parts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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

    @Builder.Default
    @Column(name = "quantity_required", nullable = false)
    private Integer quantityRequired = 1;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PartReservationStatus status = PartReservationStatus.REQUESTED;

    @Column(name = "reserved_at")
    private Instant reservedAt;

    @Column(name = "consumed_at")
    private Instant consumedAt;
}
