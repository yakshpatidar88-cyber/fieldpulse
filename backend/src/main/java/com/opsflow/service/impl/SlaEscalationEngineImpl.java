package com.opsflow.service.impl;

import com.opsflow.domain.entity.Job;
import com.opsflow.domain.entity.Sla;
import com.opsflow.domain.enums.AuditAction;
import com.opsflow.domain.enums.JobPriority;
import com.opsflow.domain.enums.NotificationSeverity;
import com.opsflow.domain.enums.SlaRiskLevel;
import com.opsflow.dto.notification.NotificationDto;
import com.opsflow.dto.notification.SlaDashboardMetricsDto;
import com.opsflow.dto.notification.SlaEscalationSummaryDto;
import com.opsflow.repository.SlaRepository;
import com.opsflow.service.AuditService;
import com.opsflow.service.NotificationService;
import com.opsflow.service.SlaEscalationEngine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class SlaEscalationEngineImpl implements SlaEscalationEngine {

    private static final Logger log = LoggerFactory.getLogger(SlaEscalationEngineImpl.class);

    private final SlaRepository slaRepository;
    private final AuditService auditService;
    private final NotificationService notificationService;

    public SlaEscalationEngineImpl(
            SlaRepository slaRepository,
            AuditService auditService,
            NotificationService notificationService) {
        this.slaRepository = slaRepository;
        this.auditService = auditService;
        this.notificationService = notificationService;
    }

    @Override
    @Transactional
    public SlaEscalationSummaryDto evaluateAndEscalateActiveSlas() {
        long startTime = System.currentTimeMillis();
        Instant now = Instant.now();

        List<Sla> activeSlas = slaRepository.findActiveUnresolvedSlas();
        int warningsEscalated = 0;
        int breachesRecorded = 0;

        for (Sla sla : activeSlas) {
            Job job = sla.getJob();
            if (job == null) {
                continue;
            }

            // 1. Check for SLA Breach (Past full resolution deadline)
            if (now.isAfter(sla.getResolutionDeadline())) {
                if (sla.getRiskLevel() != SlaRiskLevel.BREACHED) {
                    SlaRiskLevel previousRisk = sla.getRiskLevel();
                    sla.setRiskLevel(SlaRiskLevel.BREACHED);
                    if (sla.getBreachReason() == null) {
                        sla.setBreachReason("Resolution deadline exceeded without job completion");
                    }
                    slaRepository.save(sla);
                    breachesRecorded++;

                    // Immutable Audit Event
                    auditService.logEvent(
                            "Job",
                            job.getId(),
                            AuditAction.SLA_BREACHED,
                            null,
                            previousRisk.name(),
                            SlaRiskLevel.BREACHED.name(),
                            Map.of(
                                    "jobNumber", job.getJobNumber(),
                                    "resolutionDeadline", sla.getResolutionDeadline().toString(),
                                    "breachedAt", now.toString()
                            )
                    );

                    // Operational Alert Notification
                    NotificationDto alert = new NotificationDto(
                            UUID.randomUUID().toString(),
                            job.getId(),
                            job.getJobNumber(),
                            "SLA BREACHED: Job #" + job.getJobNumber(),
                            String.format("Job #%s (%s priority) has breached its SLA resolution deadline (%s). Immediate escalation required.",
                                    job.getJobNumber(), job.getPriority(), sla.getResolutionDeadline()),
                            NotificationSeverity.CRITICAL,
                            SlaRiskLevel.BREACHED,
                            now
                    );
                    notificationService.broadcastAlert(alert);
                }
                continue;
            }

            // 2. Check for SLA Warning Threshold
            Instant windowStart = sla.getCreatedAt() != null ? sla.getCreatedAt() : now.minusSeconds(60);
            long totalMillis = Duration.between(windowStart, sla.getResolutionDeadline()).toMillis();
            long elapsedMillis = Duration.between(windowStart, now).toMillis();

            if (totalMillis > 0) {
                double elapsedRatio = (double) elapsedMillis / totalMillis;
                double warningThreshold = getWarningThresholdForPriority(job.getPriority());

                if (elapsedRatio >= warningThreshold && sla.getRiskLevel() == SlaRiskLevel.HEALTHY) {
                    sla.setRiskLevel(SlaRiskLevel.WARNING);
                    slaRepository.save(sla);
                    warningsEscalated++;

                    // Immutable Audit Event
                    auditService.logEvent(
                            "Job",
                            job.getId(),
                            AuditAction.SLA_WARNING_TRIGGERED,
                            null,
                            SlaRiskLevel.HEALTHY.name(),
                            SlaRiskLevel.WARNING.name(),
                            Map.of(
                                    "jobNumber", job.getJobNumber(),
                                    "elapsedPercent", String.format("%.1f%%", elapsedRatio * 100),
                                    "resolutionDeadline", sla.getResolutionDeadline().toString()
                            )
                    );

                    // Operational Alert Notification
                    NotificationDto alert = new NotificationDto(
                            UUID.randomUUID().toString(),
                            job.getId(),
                            job.getJobNumber(),
                            "SLA Warning: Job #" + job.getJobNumber(),
                            String.format("Job #%s has consumed %.1f%% of its SLA resolution window. Deadline: %s.",
                                    job.getJobNumber(), elapsedRatio * 100, sla.getResolutionDeadline()),
                            NotificationSeverity.WARNING,
                            SlaRiskLevel.WARNING,
                            now
                    );
                    notificationService.broadcastAlert(alert);
                }
            }
        }

        long duration = System.currentTimeMillis() - startTime;
        log.info("SLA Monitoring scan completed in {}ms: {} active scanned, {} warnings escalated, {} breaches recorded",
                duration, activeSlas.size(), warningsEscalated, breachesRecorded);

        return new SlaEscalationSummaryDto(activeSlas.size(), warningsEscalated, breachesRecorded, duration, now);
    }

    @Override
    @Transactional(readOnly = true)
    public SlaDashboardMetricsDto getDashboardMetrics() {
        List<Sla> activeSlas = slaRepository.findActiveUnresolvedSlas();
        long total = activeSlas.size();
        long healthy = activeSlas.stream().filter(s -> s.getRiskLevel() == SlaRiskLevel.HEALTHY).count();
        long warning = activeSlas.stream().filter(s -> s.getRiskLevel() == SlaRiskLevel.WARNING).count();
        long breached = activeSlas.stream().filter(s -> s.getRiskLevel() == SlaRiskLevel.BREACHED).count();

        double compliance = total > 0 ? ((double) (total - breached) / total) * 100.0 : 100.0;

        return new SlaDashboardMetricsDto(
                total,
                healthy,
                warning,
                breached,
                Math.round(compliance * 100.0) / 100.0
        );
    }

    private double getWarningThresholdForPriority(JobPriority priority) {
        if (priority == null) {
            return 0.75;
        }
        return switch (priority) {
            case CRITICAL -> 0.70; // 70% elapsed
            case HIGH -> 0.75;     // 75% elapsed
            case MEDIUM -> 0.80;   // 80% elapsed
            case LOW -> 0.85;      // 85% elapsed
        };
    }
}
