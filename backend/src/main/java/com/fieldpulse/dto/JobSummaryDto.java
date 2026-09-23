package com.fieldpulse.dto;

import com.fieldpulse.domain.enums.JobPriority;
import com.fieldpulse.domain.enums.JobStatus;
import com.fieldpulse.domain.enums.SlaRiskLevel;
import java.math.BigDecimal;
import java.time.Instant;

public class JobSummaryDto {
    private Long id;
    private String jobNumber;
    private JobPriority priority;
    private JobStatus status;
    private String address;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Integer estimatedDurationMinutes;
    private String assignedTechnicianName;
    private Long assignedTechnicianId;
    private SlaRiskLevel slaRiskLevel;
    private Instant resolutionDeadline;
    private Instant createdAt;

    public JobSummaryDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getJobNumber() { return jobNumber; }
    public void setJobNumber(String jobNumber) { this.jobNumber = jobNumber; }

    public JobPriority getPriority() { return priority; }
    public void setPriority(JobPriority priority) { this.priority = priority; }

    public JobStatus getStatus() { return status; }
    public void setStatus(JobStatus status) { this.status = status; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }

    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }

    public Integer getEstimatedDurationMinutes() { return estimatedDurationMinutes; }
    public void setEstimatedDurationMinutes(Integer estimatedDurationMinutes) { this.estimatedDurationMinutes = estimatedDurationMinutes; }

    public String getAssignedTechnicianName() { return assignedTechnicianName; }
    public void setAssignedTechnicianName(String assignedTechnicianName) { this.assignedTechnicianName = assignedTechnicianName; }

    public Long getAssignedTechnicianId() { return assignedTechnicianId; }
    public void setAssignedTechnicianId(Long assignedTechnicianId) { this.assignedTechnicianId = assignedTechnicianId; }

    public SlaRiskLevel getSlaRiskLevel() { return slaRiskLevel; }
    public void setSlaRiskLevel(SlaRiskLevel slaRiskLevel) { this.slaRiskLevel = slaRiskLevel; }

    public Instant getResolutionDeadline() { return resolutionDeadline; }
    public void setResolutionDeadline(Instant resolutionDeadline) { this.resolutionDeadline = resolutionDeadline; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final JobSummaryDto dto = new JobSummaryDto();

        public Builder id(Long id) { dto.setId(id); return this; }
        public Builder jobNumber(String num) { dto.setJobNumber(num); return this; }
        public Builder priority(JobPriority priority) { dto.setPriority(priority); return this; }
        public Builder status(JobStatus status) { dto.setStatus(status); return this; }
        public Builder address(String address) { dto.setAddress(address); return this; }
        public Builder latitude(BigDecimal lat) { dto.setLatitude(lat); return this; }
        public Builder longitude(BigDecimal lng) { dto.setLongitude(lng); return this; }
        public Builder estimatedDurationMinutes(Integer dur) { dto.setEstimatedDurationMinutes(dur); return this; }
        public Builder assignedTechnicianName(String name) { dto.setAssignedTechnicianName(name); return this; }
        public Builder assignedTechnicianId(Long id) { dto.setAssignedTechnicianId(id); return this; }
        public Builder slaRiskLevel(SlaRiskLevel level) { dto.setSlaRiskLevel(level); return this; }
        public Builder resolutionDeadline(Instant deadline) { dto.setResolutionDeadline(deadline); return this; }
        public Builder createdAt(Instant time) { dto.setCreatedAt(time); return this; }
        public JobSummaryDto build() { return dto; }
    }
}
