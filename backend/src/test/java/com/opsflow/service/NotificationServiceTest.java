package com.opsflow.service;

import com.opsflow.domain.enums.NotificationSeverity;
import com.opsflow.domain.enums.SlaRiskLevel;
import com.opsflow.dto.notification.NotificationDto;
import com.opsflow.service.impl.NotificationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class NotificationServiceTest {

    private NotificationService notificationService;

    @BeforeEach
    void setUp() {
        notificationService = new NotificationServiceImpl(3); // bounded buffer size of 3
    }

    private NotificationDto createAlert(String id, String jobNumber, NotificationSeverity severity) {
        return new NotificationDto(
                id,
                100L,
                jobNumber,
                "Alert " + id,
                "Message for " + jobNumber,
                severity,
                SlaRiskLevel.WARNING,
                Instant.now()
        );
    }

    @Test
    @DisplayName("Should broadcast alerts and return them newest-first")
    void testBroadcastAndRetrieve() {
        notificationService.broadcastAlert(createAlert("alert-1", "JOB-001", NotificationSeverity.INFO));
        notificationService.broadcastAlert(createAlert("alert-2", "JOB-002", NotificationSeverity.WARNING));

        List<NotificationDto> list = notificationService.getRecentNotifications(10, false);

        assertEquals(2, list.size());
        assertEquals("alert-2", list.get(0).getId()); // newest first
        assertEquals("alert-1", list.get(1).getId());
    }

    @Test
    @DisplayName("Should filter unacknowledged notifications correctly")
    void testFilterUnacknowledged() {
        notificationService.broadcastAlert(createAlert("alert-1", "JOB-001", NotificationSeverity.WARNING));
        notificationService.broadcastAlert(createAlert("alert-2", "JOB-002", NotificationSeverity.CRITICAL));

        assertEquals(2, notificationService.getUnacknowledgedCount());

        boolean acked = notificationService.acknowledgeNotification("alert-1");
        assertTrue(acked);
        assertEquals(1, notificationService.getUnacknowledgedCount());

        List<NotificationDto> unacked = notificationService.getRecentNotifications(10, true);
        assertEquals(1, unacked.size());
        assertEquals("alert-2", unacked.get(0).getId());
    }

    @Test
    @DisplayName("Should filter notifications by severity")
    void testFilterBySeverity() {
        notificationService.broadcastAlert(createAlert("a1", "JOB-1", NotificationSeverity.INFO));
        notificationService.broadcastAlert(createAlert("a2", "JOB-2", NotificationSeverity.CRITICAL));

        List<NotificationDto> criticalOnly = notificationService.getNotificationsBySeverity(NotificationSeverity.CRITICAL);
        assertEquals(1, criticalOnly.size());
        assertEquals("a2", criticalOnly.get(0).getId());
    }

    @Test
    @DisplayName("Should evict oldest notification when buffer exceeds maximum capacity")
    void testBufferEviction() {
        notificationService.broadcastAlert(createAlert("a1", "JOB-1", NotificationSeverity.INFO));
        notificationService.broadcastAlert(createAlert("a2", "JOB-2", NotificationSeverity.WARNING));
        notificationService.broadcastAlert(createAlert("a3", "JOB-3", NotificationSeverity.CRITICAL));
        notificationService.broadcastAlert(createAlert("a4", "JOB-4", NotificationSeverity.CRITICAL));

        List<NotificationDto> list = notificationService.getRecentNotifications(10, false);
        assertEquals(3, list.size());
        // a1 should have been evicted; remaining should be a4, a3, a2
        assertEquals("a4", list.get(0).getId());
        assertEquals("a3", list.get(1).getId());
        assertEquals("a2", list.get(2).getId());
    }
}
