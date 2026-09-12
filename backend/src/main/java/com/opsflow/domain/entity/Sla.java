package com.opsflow.domain.entity;

import com.opsflow.domain.enums.SlaRiskLevel;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Duration;
import java.time.Instant;

@Entity
@Table(name = "slas")
public class Sla {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false, unique = true)
    private Job job;

    @Column(name = "response_deadline", nullable = false)
    private Instant responseDeadline;

    @Column(name = "resolution_deadline", nullable = false)
    private Instant resolutionDeadline;

    @Column(name = "responded_at")
    private Instant respondedAt;

    @Column(name = "resolved_at")
    private Instant resolvedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "risk_level", nullable = false, length = 20)
    private SlaRiskLevel riskLevel = SlaRiskLevel.HEALTHY;

    @Column(name = "breach_reason", columnDefinition = "TEXT")
    private String breachReason;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public Sla() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Job getJob() { return job; }
    public void setJob(Job job) { this.job = job; }

    public Instant getResponseDeadline() { return responseDeadline; }
    public void setResponseDeadline(Instant responseDeadline) { this.responseDeadline = responseDeadline; }

    public Instant getResolutionDeadline() { return resolutionDeadline; }
    public void setResolutionDeadline(Instant resolutionDeadline) { this.resolutionDeadline = resolutionDeadline; }

    public Instant getRespondedAt() { return respondedAt; }
    public void setRespondedAt(Instant respondedAt) { this.respondedAt = respondedAt; }

    public Instant getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(Instant resolvedAt) { this.resolvedAt = resolvedAt; }

    public SlaRiskLevel getRiskLevel() { return riskLevel; }
    public void setRiskLevel(SlaRiskLevel riskLevel) { this.riskLevel = riskLevel; }

    public String getBreachReason() { return breachReason; }
    public void setBreachReason(String breachReason) { this.breachReason = breachReason; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public void recalculateRisk(Instant now, double warningThresholdPercent) {
        if (resolvedAt != null) {
            this.riskLevel = SlaRiskLevel.HEALTHY;
            return;
        }

        if (now.isAfter(resolutionDeadline)) {
            this.riskLevel = SlaRiskLevel.BREACHED;
            return;
        }

        long totalDurationMillis = Duration.between(createdAt, resolutionDeadline).toMillis();
        long elapsedMillis = Duration.between(createdAt, now).toMillis();

        if (totalDurationMillis > 0) {
            double percentElapsed = (double) elapsedMillis / totalDurationMillis;
            if (percentElapsed >= warningThresholdPercent) {
                this.riskLevel = SlaRiskLevel.WARNING;
                return;
            }
        }

        this.riskLevel = SlaRiskLevel.HEALTHY;
    }
}
