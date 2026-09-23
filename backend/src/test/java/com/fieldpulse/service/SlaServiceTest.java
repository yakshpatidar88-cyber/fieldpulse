package com.fieldpulse.service;

import com.fieldpulse.domain.entity.Job;
import com.fieldpulse.domain.entity.Sla;
import com.fieldpulse.domain.enums.JobPriority;
import com.fieldpulse.domain.enums.SlaRiskLevel;
import com.fieldpulse.repository.SlaRepository;
import com.fieldpulse.service.impl.SlaServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Duration;
import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SlaServiceTest {

    @Mock
    private SlaRepository slaRepository;

    private SlaService slaService;

    @BeforeEach
    void setUp() {
        slaService = new SlaServiceImpl(slaRepository, 0.75);
    }

    @Test
    @DisplayName("Should create SLA with correct deadlines for CRITICAL priority")
    void testCreateSlaForCriticalJob() {
        Job job = new Job();
        job.setId(10L);
        job.setPriority(JobPriority.CRITICAL);

        when(slaRepository.save(any(Sla.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Instant before = Instant.now();
        Sla sla = slaService.createSlaForJob(job);
        Instant after = Instant.now();

        assertNotNull(sla);
        assertEquals(SlaRiskLevel.HEALTHY, sla.getRiskLevel());

        // CRITICAL response = 30m, resolution = 120m (2h)
        Duration responseDiff = Duration.between(before, sla.getResponseDeadline());
        assertTrue(responseDiff.toMinutes() >= 29 && responseDiff.toMinutes() <= 31);

        Duration resolutionDiff = Duration.between(before, sla.getResolutionDeadline());
        assertTrue(resolutionDiff.toMinutes() >= 119 && resolutionDiff.toMinutes() <= 121);

        verify(slaRepository, times(1)).save(any(Sla.class));
    }

    @Test
    @DisplayName("Should create SLA with correct deadlines for LOW priority")
    void testCreateSlaForLowJob() {
        Job job = new Job();
        job.setId(11L);
        job.setPriority(JobPriority.LOW);

        when(slaRepository.save(any(Sla.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Instant before = Instant.now();
        Sla sla = slaService.createSlaForJob(job);

        assertNotNull(sla);
        // LOW response = 240m (4h), resolution = 1440m (24h)
        Duration responseDiff = Duration.between(before, sla.getResponseDeadline());
        assertTrue(responseDiff.toMinutes() >= 239 && responseDiff.toMinutes() <= 241);

        Duration resolutionDiff = Duration.between(before, sla.getResolutionDeadline());
        assertTrue(resolutionDiff.toMinutes() >= 1439 && resolutionDiff.toMinutes() <= 1441);
    }

    @Test
    @DisplayName("Should evaluate risk as HEALTHY when elapsed time is below warning threshold")
    void testEvaluateRiskHealthy() {
        Instant created = Instant.now().minus(Duration.ofMinutes(30));
        Instant deadline = Instant.now().plus(Duration.ofMinutes(90)); // total 120m, 30m elapsed = 25%

        Sla sla = new Sla();
        sla.setCreatedAt(created);
        sla.setResolutionDeadline(deadline);

        slaService.evaluateRisk(sla, Instant.now());

        assertEquals(SlaRiskLevel.HEALTHY, sla.getRiskLevel());
    }

    @Test
    @DisplayName("Should evaluate risk as WARNING when elapsed time is >= 75% of window")
    void testEvaluateRiskWarning() {
        Instant created = Instant.now().minus(Duration.ofMinutes(80));
        Instant deadline = Instant.now().plus(Duration.ofMinutes(20)); // total 100m, 80m elapsed = 80%

        Sla sla = new Sla();
        sla.setCreatedAt(created);
        sla.setResolutionDeadline(deadline);

        slaService.evaluateRisk(sla, Instant.now());

        assertEquals(SlaRiskLevel.WARNING, sla.getRiskLevel());
    }

    @Test
    @DisplayName("Should evaluate risk as BREACHED when current time is after deadline")
    void testEvaluateRiskBreached() {
        Instant created = Instant.now().minus(Duration.ofHours(5));
        Instant deadline = Instant.now().minus(Duration.ofHours(1)); // deadline in the past

        Sla sla = new Sla();
        sla.setCreatedAt(created);
        sla.setResolutionDeadline(deadline);

        slaService.evaluateRisk(sla, Instant.now());

        assertEquals(SlaRiskLevel.BREACHED, sla.getRiskLevel());
        assertNotNull(sla.getBreachReason());
    }

    @Test
    @DisplayName("Should evaluate risk as HEALTHY if SLA is already resolved")
    void testEvaluateRiskWhenResolved() {
        Instant deadline = Instant.now().minus(Duration.ofHours(1));

        Sla sla = new Sla();
        sla.setResolutionDeadline(deadline);
        sla.setResolvedAt(Instant.now().minus(Duration.ofHours(2))); // resolved before deadline

        slaService.evaluateRisk(sla, Instant.now());

        assertEquals(SlaRiskLevel.HEALTHY, sla.getRiskLevel());
    }

    @Test
    @DisplayName("Should record response timestamp on SLA")
    void testRecordResponse() {
        Sla sla = new Sla();
        Instant now = Instant.now();

        slaService.recordResponse(sla, now);

        assertEquals(now, sla.getRespondedAt());
        verify(slaRepository, times(1)).save(sla);
    }

    @Test
    @DisplayName("Should record resolution timestamp and evaluate risk")
    void testRecordResolution() {
        Sla sla = new Sla();
        sla.setCreatedAt(Instant.now().minus(Duration.ofHours(2)));
        sla.setResolutionDeadline(Instant.now().plus(Duration.ofHours(2)));
        Instant resolvedAt = Instant.now();

        slaService.recordResolution(sla, resolvedAt);

        assertEquals(resolvedAt, sla.getResolvedAt());
        assertEquals(SlaRiskLevel.HEALTHY, sla.getRiskLevel());
        verify(slaRepository, times(1)).save(sla);
    }
}
