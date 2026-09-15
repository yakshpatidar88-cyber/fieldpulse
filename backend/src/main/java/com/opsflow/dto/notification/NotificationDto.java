package com.opsflow.dto.notification;

import com.opsflow.domain.enums.NotificationSeverity;
import com.opsflow.domain.enums.SlaRiskLevel;

import java.time.Instant;

public class NotificationDto {
    private String id;
    private Long jobId;
    private String jobNumber;
    private String title;
    private String message;
    private NotificationSeverity severity;
    private SlaRiskLevel riskLevel;
    private Instant createdAt;
    private boolean acknowledged;

    public NotificationDto() {}

    public NotificationDto(String id, Long jobId, String jobNumber, String title, String message,
                           NotificationSeverity severity, SlaRiskLevel riskLevel, Instant createdAt) {
        this.id = id;
        this.jobId = jobId;
        this.jobNumber = jobNumber;
        this.title = title;
        this.message = message;
        this.severity = severity;
        this.riskLevel = riskLevel;
        this.createdAt = createdAt;
        this.acknowledged = false;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public String getJobNumber() { return jobNumber; }
    public void setJobNumber(String jobNumber) { this.jobNumber = jobNumber; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public NotificationSeverity getSeverity() { return severity; }
    public void setSeverity(NotificationSeverity severity) { this.severity = severity; }

    public SlaRiskLevel getRiskLevel() { return riskLevel; }
    public void setRiskLevel(SlaRiskLevel riskLevel) { this.riskLevel = riskLevel; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public boolean isAcknowledged() { return acknowledged; }
    public void setAcknowledged(boolean acknowledged) { this.acknowledged = acknowledged; }
}
