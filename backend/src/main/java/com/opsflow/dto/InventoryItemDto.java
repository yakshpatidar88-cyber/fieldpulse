package com.opsflow.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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
}
