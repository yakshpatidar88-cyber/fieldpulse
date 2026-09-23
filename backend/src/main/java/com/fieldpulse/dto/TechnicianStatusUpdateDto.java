package com.fieldpulse.dto;

import com.fieldpulse.domain.enums.TechnicianStatus;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class TechnicianStatusUpdateDto {

    @NotNull(message = "Technician status is required")
    private TechnicianStatus status;

    private BigDecimal currentLatitude;
    private BigDecimal currentLongitude;

    public TechnicianStatusUpdateDto() {}

    public TechnicianStatus getStatus() { return status; }
    public void setStatus(TechnicianStatus status) { this.status = status; }

    public BigDecimal getCurrentLatitude() { return currentLatitude; }
    public void setCurrentLatitude(BigDecimal currentLatitude) { this.currentLatitude = currentLatitude; }

    public BigDecimal getCurrentLongitude() { return currentLongitude; }
    public void setCurrentLongitude(BigDecimal currentLongitude) { this.currentLongitude = currentLongitude; }
}
