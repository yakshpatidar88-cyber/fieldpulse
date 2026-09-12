package com.opsflow.dto;

import com.opsflow.domain.enums.TechnicianStatus;
import java.math.BigDecimal;

public class TechnicianSummaryDto {
    private Long id;
    private String fullName;
    private String employeeCode;
    private TechnicianStatus status;
    private Integer activeJobsCount;
    private Integer maxConcurrentJobs;
    private BigDecimal rating;
    private BigDecimal currentLatitude;
    private BigDecimal currentLongitude;

    public TechnicianSummaryDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmployeeCode() { return employeeCode; }
    public void setEmployeeCode(String employeeCode) { this.employeeCode = employeeCode; }

    public TechnicianStatus getStatus() { return status; }
    public void setStatus(TechnicianStatus status) { this.status = status; }

    public Integer getActiveJobsCount() { return activeJobsCount; }
    public void setActiveJobsCount(Integer activeJobsCount) { this.activeJobsCount = activeJobsCount; }

    public Integer getMaxConcurrentJobs() { return maxConcurrentJobs; }
    public void setMaxConcurrentJobs(Integer maxConcurrentJobs) { this.maxConcurrentJobs = maxConcurrentJobs; }

    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }

    public BigDecimal getCurrentLatitude() { return currentLatitude; }
    public void setCurrentLatitude(BigDecimal currentLatitude) { this.currentLatitude = currentLatitude; }

    public BigDecimal getCurrentLongitude() { return currentLongitude; }
    public void setCurrentLongitude(BigDecimal currentLongitude) { this.currentLongitude = currentLongitude; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final TechnicianSummaryDto dto = new TechnicianSummaryDto();

        public Builder id(Long id) { dto.setId(id); return this; }
        public Builder fullName(String name) { dto.setFullName(name); return this; }
        public Builder employeeCode(String code) { dto.setEmployeeCode(code); return this; }
        public Builder status(TechnicianStatus status) { dto.setStatus(status); return this; }
        public Builder activeJobsCount(Integer count) { dto.setActiveJobsCount(count); return this; }
        public Builder maxConcurrentJobs(Integer max) { dto.setMaxConcurrentJobs(max); return this; }
        public Builder rating(BigDecimal rating) { dto.setRating(rating); return this; }
        public Builder currentLatitude(BigDecimal lat) { dto.setCurrentLatitude(lat); return this; }
        public Builder currentLongitude(BigDecimal lng) { dto.setCurrentLongitude(lng); return this; }
        public TechnicianSummaryDto build() { return dto; }
    }
}
