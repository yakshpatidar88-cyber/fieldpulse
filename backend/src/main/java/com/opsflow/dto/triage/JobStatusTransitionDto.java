package com.opsflow.dto.triage;

import com.opsflow.domain.enums.JobStatus;
import jakarta.validation.constraints.NotNull;

public class JobStatusTransitionDto {

    @NotNull(message = "Target status is required")
    private JobStatus status;

    private String notes;

    public JobStatusTransitionDto() {}

    public JobStatusTransitionDto(JobStatus status, String notes) {
        this.status = status;
        this.notes = notes;
    }

    public JobStatus getStatus() { return status; }
    public void setStatus(JobStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
