package com.opsflow.service;

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
import com.opsflow.service.impl.SlaEscalationEngineImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SlaEscalationEngineTest {

    @Mock
    private SlaRepository slaRepository;

    @Mock
    private AuditService auditService;

    @Mock
    private NotificationService notificationService;

    private SlaEscalationEngine escalationEngine;

    @BeforeEach
    void setUp() {
        escalationEngine = new SlaEscalationEngineImpl(slaRepository, auditService, notificationService);
    }

    private Job createJob(Long id, String jobNumber, JobPriority priority) {
        Job job = new Job();
        job.setId(id);
        job.setJobNumber(jobNumber);
        job.setPriority(priority);
        return job;
    }

    private Sla createSla(Long id, Job job, Instant created, Instant deadline, SlaRiskLevel riskLevel) {
        Sla sla = new Sla();
        sla.setId(id);
        sla.setJob(job);
        sla.setCreatedAt(created);
        sla.setResolutionDeadline(deadline);
        sla.setRiskLevel(riskLevel);
        return sla;
    }

    @Test
    @DisplayName("Should escalate HEALTHY SLA to WARNING when elapsed window exceeds threshold")
    void testEscalateToWarning() {
        // HIGH priority threshold is 75%
        // Created 80 mins ago, deadline in 20 mins -> total 100 mins, elapsed 80% >= 75%
        Instant now = Instant.now();
        Job job = createJob(10L, "JOB-2026-0010", JobPriority.HIGH);
        Sla sla = createSla(1L, job, now.minus(Duration.ofMinutes(80)), now.plus(Duration.ofMinutes(20)), SlaRiskLevel.HEALTHY);

        when(slaRepository.findActiveUnresolvedSlas()).thenReturn(List.of(sla));
        when(slaRepository.save(any(Sla.class))).thenAnswer(inv -> inv.getArgument(0));

        SlaEscalationSummaryDto summary = escalationEngine.evaluateAndEscalateActiveSlas();

        assertEquals(1, summary.getScannedCount());
        assertEquals(1, summary.getWarningsEscalated());
        assertEquals(0, summary.getBreachesRecorded());
        assertEquals(SlaRiskLevel.WARNING, sla.getRiskLevel());

        verify(slaRepository, times(1)).save(sla);
        verify(auditService, times(1)).logEvent(
                eq("Job"),
                eq(10L),
                eq(AuditAction.SLA_WARNING_TRIGGERED),
                isNull(),
                eq("HEALTHY"),
                eq("WARNING"),
                any()
        );

        ArgumentCaptor<NotificationDto> alertCaptor = ArgumentCaptor.forClass(NotificationDto.class);
        verify(notificationService, times(1)).broadcastAlert(alertCaptor.capture());
        assertEquals(NotificationSeverity.WARNING, alertCaptor.getValue().getSeverity());
        assertEquals("JOB-2026-0010", alertCaptor.getValue().getJobNumber());
    }

    @Test
    @DisplayName("Should escalate SLA to BREACHED when current time is past resolution deadline")
    void testEscalateToBreached() {
        Instant now = Instant.now();
        Job job = createJob(20L, "JOB-2026-0020", JobPriority.CRITICAL);
        // Deadline was 10 minutes ago
        Sla sla = createSla(2L, job, now.minus(Duration.ofHours(3)), now.minus(Duration.ofMinutes(10)), SlaRiskLevel.WARNING);

        when(slaRepository.findActiveUnresolvedSlas()).thenReturn(List.of(sla));
        when(slaRepository.save(any(Sla.class))).thenAnswer(inv -> inv.getArgument(0));

        SlaEscalationSummaryDto summary = escalationEngine.evaluateAndEscalateActiveSlas();

        assertEquals(1, summary.getScannedCount());
        assertEquals(0, summary.getWarningsEscalated());
        assertEquals(1, summary.getBreachesRecorded());
        assertEquals(SlaRiskLevel.BREACHED, sla.getRiskLevel());
        assertNotNull(sla.getBreachReason());

        verify(slaRepository, times(1)).save(sla);
        verify(auditService, times(1)).logEvent(
                eq("Job"),
                eq(20L),
                eq(AuditAction.SLA_BREACHED),
                isNull(),
                eq("WARNING"),
                eq("BREACHED"),
                any()
        );

        ArgumentCaptor<NotificationDto> alertCaptor = ArgumentCaptor.forClass(NotificationDto.class);
        verify(notificationService, times(1)).broadcastAlert(alertCaptor.capture());
        assertEquals(NotificationSeverity.CRITICAL, alertCaptor.getValue().getSeverity());
        assertTrue(alertCaptor.getValue().getTitle().contains("SLA BREACHED"));
    }

    @Test
    @DisplayName("Idempotency: Should not duplicate alerts for SLAs already marked as BREACHED")
    void testIdempotentBreachHandling() {
        Instant now = Instant.now();
        Job job = createJob(30L, "JOB-2026-0030", JobPriority.MEDIUM);
        // Already breached in previous run
        Sla sla = createSla(3L, job, now.minus(Duration.ofHours(10)), now.minus(Duration.ofHours(2)), SlaRiskLevel.BREACHED);

        when(slaRepository.findActiveUnresolvedSlas()).thenReturn(List.of(sla));

        SlaEscalationSummaryDto summary = escalationEngine.evaluateAndEscalateActiveSlas();

        assertEquals(1, summary.getScannedCount());
        assertEquals(0, summary.getWarningsEscalated());
        assertEquals(0, summary.getBreachesRecorded());

        verify(slaRepository, never()).save(any());
        verify(auditService, never()).logEvent(any(), any(), any(), any(), any(), any(), any());
        verify(notificationService, never()).broadcastAlert(any());
    }

    @Test
    @DisplayName("Should accurately compute dashboard SLA metrics and compliance rate")
    void testGetDashboardMetrics() {
        Instant now = Instant.now();
        Job j1 = createJob(1L, "J1", JobPriority.LOW);
        Job j2 = createJob(2L, "J2", JobPriority.MEDIUM);
        Job j3 = createJob(3L, "J3", JobPriority.HIGH);
        Job j4 = createJob(4L, "J4", JobPriority.CRITICAL);

        Sla s1 = createSla(1L, j1, now, now.plus(Duration.ofHours(5)), SlaRiskLevel.HEALTHY);
        Sla s2 = createSla(2L, j2, now, now.plus(Duration.ofHours(4)), SlaRiskLevel.HEALTHY);
        Sla s3 = createSla(3L, j3, now, now.plus(Duration.ofHours(1)), SlaRiskLevel.WARNING);
        Sla s4 = createSla(4L, j4, now.minus(Duration.ofHours(3)), now.minus(Duration.ofMinutes(30)), SlaRiskLevel.BREACHED);

        when(slaRepository.findActiveUnresolvedSlas()).thenReturn(List.of(s1, s2, s3, s4));

        SlaDashboardMetricsDto metrics = escalationEngine.getDashboardMetrics();

        assertEquals(4, metrics.getTotalActiveJobs());
        assertEquals(2, metrics.getHealthyCount());
        assertEquals(1, metrics.getWarningCount());
        assertEquals(1, metrics.getBreachedCount());
        // 3 non-breached out of 4 = 75.0%
        assertEquals(75.0, metrics.getComplianceRatePercent());
    }
}
