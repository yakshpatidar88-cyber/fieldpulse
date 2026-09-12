package com.opsflow.domain.entity;

import com.opsflow.domain.enums.SlaRiskLevel;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Duration;
import java.time.Instant;

@Entity
@Table(name = "slas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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

    @Builder.Default
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
