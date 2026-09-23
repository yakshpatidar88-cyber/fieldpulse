package com.fieldpulse.service;

import com.fieldpulse.domain.enums.NotificationSeverity;
import com.fieldpulse.dto.notification.NotificationDto;

import java.util.List;

public interface NotificationService {

    /**
     * Broadcasts and stores an operational notification.
     *
     * @param alert Notification alert payload
     */
    void broadcastAlert(NotificationDto alert);

    /**
     * Retrieves recent notifications with optional unacknowledged filter.
     *
     * @param limit Maximum count to return
     * @param unacknowledgedOnly If true, only returns alerts that haven't been acknowledged
     * @return List of NotificationDto sorted newest first
     */
    List<NotificationDto> getRecentNotifications(int limit, boolean unacknowledgedOnly);

    /**
     * Retrieves notifications filtered by severity level.
     *
     * @param severity Severity level (INFO, WARNING, CRITICAL)
     * @return List of NotificationDto
     */
    List<NotificationDto> getNotificationsBySeverity(NotificationSeverity severity);

    /**
     * Marks a notification as acknowledged by an operator.
     *
     * @param notificationId ID of the notification
     * @return true if found and marked, false otherwise
     */
    boolean acknowledgeNotification(String notificationId);

    /**
     * Returns total count of unacknowledged alerts.
     */
    long getUnacknowledgedCount();

    /**
     * Clears all stored notifications (used for testing or maintenance).
     */
    void clearAll();
}
