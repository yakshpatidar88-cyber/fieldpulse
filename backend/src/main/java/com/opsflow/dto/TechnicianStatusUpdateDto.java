package com.opsflow.dto;

import com.opsflow.domain.enums.TechnicianStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TechnicianStatusUpdateDto {

    @NotNull(message = "Technician status is required")
    private TechnicianStatus status;

    private BigDecimal currentLatitude;
    private BigDecimal currentLongitude;
}
