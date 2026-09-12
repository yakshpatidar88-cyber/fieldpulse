package com.opsflow.dto;

import com.opsflow.domain.enums.PartReservationStatus;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobPartDto {
    private Long id;
    private Long inventoryItemId;
    private String sku;
    private String partName;
    private Integer quantityRequired;
    private PartReservationStatus status;
    private Instant reservedAt;
    private Instant consumedAt;
}
