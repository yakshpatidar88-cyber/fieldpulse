package com.opsflow.controller;

import com.opsflow.domain.enums.NotificationSeverity;
import com.opsflow.dto.common.ApiResponse;
import com.opsflow.dto.notification.NotificationDto;
import com.opsflow.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@Tag(name = "Notifications", description = "Real-time operational alerts, SLA warnings, and notification acknowledgement")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    @Operation(summary = "Get recent operational notifications",
               description = "Retrieves real-time alerts with optional filtering by severity and unacknowledged status.")
    public ResponseEntity<ApiResponse<List<NotificationDto>>> getNotifications(
            @RequestParam(required = false, defaultValue = "50") int limit,
            @RequestParam(required = false, defaultValue = "false") boolean unacknowledgedOnly,
            @RequestParam(required = false) NotificationSeverity severity) {

        List<NotificationDto> results;
        if (severity != null) {
            results = notificationService.getNotificationsBySeverity(severity);
        } else {
            results = notificationService.getRecentNotifications(limit, unacknowledgedOnly);
        }

        return ResponseEntity.ok(ApiResponse.ok(results));
    }

    @PostMapping("/{id}/ack")
    @Operation(summary = "Acknowledge notification",
               description = "Marks an alert as acknowledged by a dispatcher or operator.")
    public ResponseEntity<ApiResponse<Void>> acknowledgeNotification(@PathVariable String id) {
        boolean acked = notificationService.acknowledgeNotification(id);
        if (!acked) {
            return ResponseEntity.ok(ApiResponse.ok("Notification not found or already acknowledged", null));
        }
        return ResponseEntity.ok(ApiResponse.ok("Notification acknowledged successfully", null));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get count of unread/unacknowledged alerts",
               description = "Returns current count of unacknowledged operational notifications.")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount() {
        long count = notificationService.getUnacknowledgedCount();
        return ResponseEntity.ok(ApiResponse.ok(count));
    }
}
