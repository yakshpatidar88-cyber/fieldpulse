package com.opsflow.dto.dispatch;

import jakarta.validation.constraints.NotNull;

public class ConfirmAssignmentDto {

    @NotNull(message = "Job ID is required")
    private Long jobId;

    @NotNull(message = "Technician ID is required")
    private Long technicianId;

    private String notes;

    public ConfirmAssignmentDto() {}

    public ConfirmAssignmentDto(Long jobId, Long technicianId, String notes) {
        this.jobId = jobId;
        this.technicianId = technicianId;
        this.notes = notes;
    }

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public Long getTechnicianId() { return technicianId; }
    public void setTechnicianId(Long technicianId) { this.technicianId = technicianId; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
