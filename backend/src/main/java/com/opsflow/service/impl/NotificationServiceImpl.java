package com.opsflow.service.impl;

import com.opsflow.domain.enums.NotificationSeverity;
import com.opsflow.dto.notification.NotificationDto;
import com.opsflow.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ConcurrentLinkedDeque;

@Service
public class NotificationServiceImpl implements NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationServiceImpl.class);

    private final ConcurrentLinkedDeque<NotificationDto> notifications = new ConcurrentLinkedDeque<>();
    private final int maxBufferSize;

    public NotificationServiceImpl(@Value("${opsflow.notifications.max-buffer-size:500}") int maxBufferSize) {
        this.maxBufferSize = maxBufferSize;
    }

    @Override
    public void broadcastAlert(NotificationDto alert) {
        if (alert == null) {
            return;
        }

        notifications.addFirst(alert);

        // Evict oldest if exceeding max size
        while (notifications.size() > maxBufferSize) {
            notifications.pollLast();
        }

        log.info("OPERATIONAL ALERT [{}]: Job #{} - {} | {}",
                alert.getSeverity(), alert.getJobNumber(), alert.getTitle(), alert.getMessage());
    }

    @Override
    public List<NotificationDto> getRecentNotifications(int limit, boolean unacknowledgedOnly) {
        return notifications.stream()
                .filter(n -> !unacknowledgedOnly || !n.isAcknowledged())
                .limit(limit > 0 ? limit : 50)
                .toList();
    }

    @Override
    public List<NotificationDto> getNotificationsBySeverity(NotificationSeverity severity) {
        return notifications.stream()
                .filter(n -> n.getSeverity() == severity)
                .toList();
    }

    @Override
    public boolean acknowledgeNotification(String notificationId) {
        for (NotificationDto n : notifications) {
            if (n.getId() != null && n.getId().equals(notificationId)) {
                n.setAcknowledged(true);
                return true;
            }
        }
        return false;
    }

    @Override
    public long getUnacknowledgedCount() {
        return notifications.stream().filter(n -> !n.isAcknowledged()).count();
    }

    @Override
    public void clearAll() {
        notifications.clear();
    }
}
