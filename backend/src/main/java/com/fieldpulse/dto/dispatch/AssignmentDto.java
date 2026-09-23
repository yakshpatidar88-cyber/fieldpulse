package com.fieldpulse.dto.dispatch;

import com.fieldpulse.domain.enums.AssignmentStatus;

import java.math.BigDecimal;
import java.time.Instant;

public class AssignmentDto {
    private Long id;
    private Long jobId;
    private String jobNumber;
    private Long technicianId;
    private String technicianName;
    private String technicianEmployeeCode;
    private String assignedBy;
    private BigDecimal dispatchScore;
    private String scoreExplanation;
    private AssignmentStatus status;
    private Instant offeredAt;
    private Instant respondedAt;
    private String rejectionReason;

    public AssignmentDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public String getJobNumber() { return jobNumber; }
    public void setJobNumber(String jobNumber) { this.jobNumber = jobNumber; }

    public Long getTechnicianId() { return technicianId; }
    public void setTechnicianId(Long technicianId) { this.technicianId = technicianId; }

    public String getTechnicianName() { return technicianName; }
    public void setTechnicianName(String technicianName) { this.technicianName = technicianName; }

    public String getTechnicianEmployeeCode() { return technicianEmployeeCode; }
    public void setTechnicianEmployeeCode(String technicianEmployeeCode) { this.technicianEmployeeCode = technicianEmployeeCode; }

    public String getAssignedBy() { return assignedBy; }
    public void setAssignedBy(String assignedBy) { this.assignedBy = assignedBy; }

    public BigDecimal getDispatchScore() { return dispatchScore; }
    public void setDispatchScore(BigDecimal dispatchScore) { this.dispatchScore = dispatchScore; }

    public String getScoreExplanation() { return scoreExplanation; }
    public void setScoreExplanation(String scoreExplanation) { this.scoreExplanation = scoreExplanation; }

    public AssignmentStatus getStatus() { return status; }
    public void setStatus(AssignmentStatus status) { this.status = status; }

    public Instant getOfferedAt() { return offeredAt; }
    public void setOfferedAt(Instant offeredAt) { this.offeredAt = offeredAt; }

    public Instant getRespondedAt() { return respondedAt; }
    public void setRespondedAt(Instant respondedAt) { this.respondedAt = respondedAt; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
}
