package com.opsflow.dto;

import com.opsflow.domain.enums.JobPriority;

import java.math.BigDecimal;
import java.time.Instant;

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

    public ServiceRequestDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }

    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public JobPriority getPriority() { return priority; }
    public void setPriority(JobPriority priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final ServiceRequestDto dto = new ServiceRequestDto();

        public Builder id(Long id) { dto.setId(id); return this; }
        public Builder customerName(String customerName) { dto.setCustomerName(customerName); return this; }
        public Builder customerEmail(String customerEmail) { dto.setCustomerEmail(customerEmail); return this; }
        public Builder customerPhone(String customerPhone) { dto.setCustomerPhone(customerPhone); return this; }
        public Builder address(String address) { dto.setAddress(address); return this; }
        public Builder latitude(BigDecimal latitude) { dto.setLatitude(latitude); return this; }
        public Builder longitude(BigDecimal longitude) { dto.setLongitude(longitude); return this; }
        public Builder description(String description) { dto.setDescription(description); return this; }
        public Builder priority(JobPriority priority) { dto.setPriority(priority); return this; }
        public Builder status(String status) { dto.setStatus(status); return this; }
        public Builder createdAt(Instant createdAt) { dto.setCreatedAt(createdAt); return this; }
        public Builder updatedAt(Instant updatedAt) { dto.setUpdatedAt(updatedAt); return this; }
        public ServiceRequestDto build() { return dto; }
    }
}
