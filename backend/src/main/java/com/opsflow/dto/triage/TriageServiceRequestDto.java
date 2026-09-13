package com.opsflow.dto.triage;

import com.opsflow.domain.enums.JobPriority;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class TriageServiceRequestDto {

    @NotNull(message = "Job priority is required")
    private JobPriority priority;

    @NotEmpty(message = "At least one required skill must be specified")
    private Set<Long> requiredSkillIds = new HashSet<>();

    @NotNull(message = "Estimated duration in minutes is required")
    @Min(value = 15, message = "Estimated duration must be at least 15 minutes")
    private Integer estimatedDurationMinutes = 60;

    private Instant scheduledStartTime;

    private List<JobPartRequirementDto> requiredParts = new ArrayList<>();

    public TriageServiceRequestDto() {}

    public JobPriority getPriority() { return priority; }
    public void setPriority(JobPriority priority) { this.priority = priority; }

    public Set<Long> getRequiredSkillIds() { return requiredSkillIds; }
    public void setRequiredSkillIds(Set<Long> requiredSkillIds) { this.requiredSkillIds = requiredSkillIds; }

    public Integer getEstimatedDurationMinutes() { return estimatedDurationMinutes; }
    public void setEstimatedDurationMinutes(Integer estimatedDurationMinutes) { this.estimatedDurationMinutes = estimatedDurationMinutes; }

    public Instant getScheduledStartTime() { return scheduledStartTime; }
    public void setScheduledStartTime(Instant scheduledStartTime) { this.scheduledStartTime = scheduledStartTime; }

    public List<JobPartRequirementDto> getRequiredParts() { return requiredParts; }
    public void setRequiredParts(List<JobPartRequirementDto> requiredParts) { this.requiredParts = requiredParts; }
}
