package com.opsflow.dto;

import com.opsflow.domain.enums.JobPriority;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceRequestDto {
    private Long id;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String address;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String description;
    private JobPriority priority;
    private String status;
    private Instant createdAt;
    private Instant updatedAt;
}
