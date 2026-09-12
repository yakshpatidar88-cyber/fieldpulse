package com.opsflow.dto;

import com.opsflow.domain.enums.JobPriority;
import com.opsflow.domain.enums.JobStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class JobDto {
    private Long id;
    private String jobNumber;
    private Long serviceRequestId;
    private JobPriority priority;
    private JobStatus status;
    private String address;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Integer estimatedDurationMinutes;
    private Instant scheduledStartTime;
    private Instant actualStartTime;
    private Instant completedAt;
    private String completionNotes;
    private TechnicianSummaryDto assignedTechnician;
    private Set<SkillDto> requiredSkills = new HashSet<>();
    private SlaDto sla;
    private List<JobPartDto> parts = new ArrayList<>();
    private Instant createdAt;
    private Instant updatedAt;

    public JobDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getJobNumber() { return jobNumber; }
    public void setJobNumber(String jobNumber) { this.jobNumber = jobNumber; }

    public Long getServiceRequestId() { return serviceRequestId; }
    public void setServiceRequestId(Long serviceRequestId) { this.serviceRequestId = serviceRequestId; }

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

    public Instant getScheduledStartTime() { return scheduledStartTime; }
    public void setScheduledStartTime(Instant scheduledStartTime) { this.scheduledStartTime = scheduledStartTime; }

    public Instant getActualStartTime() { return actualStartTime; }
    public void setActualStartTime(Instant actualStartTime) { this.actualStartTime = actualStartTime; }

    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }

    public String getCompletionNotes() { return completionNotes; }
    public void setCompletionNotes(String completionNotes) { this.completionNotes = completionNotes; }

    public TechnicianSummaryDto getAssignedTechnician() { return assignedTechnician; }
    public void setAssignedTechnician(TechnicianSummaryDto assignedTechnician) { this.assignedTechnician = assignedTechnician; }

    public Set<SkillDto> getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(Set<SkillDto> requiredSkills) { this.requiredSkills = requiredSkills; }

    public SlaDto getSla() { return sla; }
    public void setSla(SlaDto sla) { this.sla = sla; }

    public List<JobPartDto> getParts() { return parts; }
    public void setParts(List<JobPartDto> parts) { this.parts = parts; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final JobDto dto = new JobDto();

        public Builder id(Long id) { dto.setId(id); return this; }
        public Builder jobNumber(String num) { dto.setJobNumber(num); return this; }
        public Builder serviceRequestId(Long id) { dto.setServiceRequestId(id); return this; }
        public Builder priority(JobPriority p) { dto.setPriority(p); return this; }
        public Builder status(JobStatus s) { dto.setStatus(s); return this; }
        public Builder address(String addr) { dto.setAddress(addr); return this; }
        public Builder latitude(BigDecimal lat) { dto.setLatitude(lat); return this; }
        public Builder longitude(BigDecimal lng) { dto.setLongitude(lng); return this; }
        public Builder estimatedDurationMinutes(Integer dur) { dto.setEstimatedDurationMinutes(dur); return this; }
        public Builder scheduledStartTime(Instant t) { dto.setScheduledStartTime(t); return this; }
        public Builder actualStartTime(Instant t) { dto.setActualStartTime(t); return this; }
        public Builder completedAt(Instant t) { dto.setCompletedAt(t); return this; }
        public Builder completionNotes(String notes) { dto.setCompletionNotes(notes); return this; }
        public Builder assignedTechnician(TechnicianSummaryDto tech) { dto.setAssignedTechnician(tech); return this; }
        public Builder requiredSkills(Set<SkillDto> skills) { dto.setRequiredSkills(skills); return this; }
        public Builder sla(SlaDto sla) { dto.setSla(sla); return this; }
        public Builder parts(List<JobPartDto> parts) { dto.setParts(parts); return this; }
        public Builder createdAt(Instant t) { dto.setCreatedAt(t); return this; }
        public Builder updatedAt(Instant t) { dto.setUpdatedAt(t); return this; }
        public JobDto build() { return dto; }
    }
}
