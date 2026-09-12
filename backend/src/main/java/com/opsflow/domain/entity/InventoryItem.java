package com.opsflow.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "inventory_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String sku;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 50)
    private String category;

    @Builder.Default
    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "quantity_available", nullable = false)
    private Integer quantityAvailable = 0;

    @Builder.Default
    @Column(name = "quantity_reserved", nullable = false)
    private Integer quantityReserved = 0;

    @Builder.Default
    @Column(name = "minimum_threshold", nullable = false)
    private Integer minimumThreshold = 5;

    @Column(name = "warehouse_location", nullable = false, length = 100)
    private String warehouseLocation;

    @Version
    @Column(nullable = false)
    private Long version;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public boolean hasSufficientStock(int quantity) {
        return this.quantityAvailable >= quantity;
    }

    public void reserveStock(int quantity) {
        if (!hasSufficientStock(quantity)) {
            throw new IllegalStateException(
                String.format("Insufficient inventory for SKU %s. Available: %d, Requested: %d", sku, quantityAvailable, quantity)
            );
        }
        this.quantityAvailable -= quantity;
        this.quantityReserved += quantity;
    }

    public void releaseStock(int quantity) {
        if (this.quantityReserved < quantity) {
            throw new IllegalStateException(
                String.format("Cannot release %d units of SKU %s. Only %d units are currently reserved.", quantity, sku, quantityReserved)
            );
        }
        this.quantityReserved -= quantity;
        this.quantityAvailable += quantity;
    }

    public void consumeStock(int quantity) {
        if (this.quantityReserved < quantity) {
            throw new IllegalStateException(
                String.format("Cannot consume %d units of SKU %s without prior reservation. Reserved: %d", quantity, sku, quantityReserved)
            );
        }
        this.quantityReserved -= quantity;
    }
}
