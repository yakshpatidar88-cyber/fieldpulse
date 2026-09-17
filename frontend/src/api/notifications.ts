import apiClient from './client';
import { ApiResponse } from '../types/api';
import { SlaDashboardMetrics } from '../types/sla';
import { Notification, NotificationSeverity } from '../types/notification';

export interface SlaEscalationSummary {
  scannedCount: number;
  warningsEscalated: number;
  breachesRecorded: number;
  executionDurationMs: number;
  scannedAt: string;
}

export const notificationApi = {
  /**
   * Fetch recent notifications with optional severity & unread filter
   */
  getNotifications: async (
    limit: number = 50,
    unacknowledgedOnly: boolean = false,
    severity?: NotificationSeverity
  ): Promise<Notification[]> => {
    const params: Record<string, any> = {
      limit,
      unacknowledgedOnly,
    };
    if (severity) params.severity = severity;

    const response = await apiClient.get<ApiResponse<Notification[]>>(
      '/notifications',
      { params }
    );
    return response.data.data;
  },

  /**
   * Acknowledge notification by ID
   */
  acknowledgeNotification: async (id: string): Promise<void> => {
    await apiClient.post<ApiResponse<void>>(`/notifications/${id}/ack`);
  },

  /**
   * Get unacknowledged alerts count
   */
  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get<ApiResponse<number>>(
      '/notifications/unread-count'
    );
    return response.data.data;
  },
};

export const slaApi = {
  /**
   * Fetch aggregate SLA dashboard metrics
   */
  getDashboardMetrics: async (): Promise<SlaDashboardMetrics> => {
    const response = await apiClient.get<ApiResponse<SlaDashboardMetrics>>(
      '/sla/dashboard'
    );
    return response.data.data;
  },

  /**
   * Manually trigger background SLA escalation scan
   */
  runManualScan: async (): Promise<SlaEscalationSummary> => {
    const response = await apiClient.post<ApiResponse<SlaEscalationSummary>>(
      '/sla/monitor/run'
    );
    return response.data.data;
  },
};
