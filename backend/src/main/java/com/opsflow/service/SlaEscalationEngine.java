package com.opsflow.service;

import com.opsflow.dto.notification.SlaDashboardMetricsDto;
import com.opsflow.dto.notification.SlaEscalationSummaryDto;

public interface SlaEscalationEngine {

    /**
     * Evaluates all active, unresolved SLAs, applies priority-calibrated threshold checks,
     * escalates risk levels (HEALTHY -> WARNING -> BREACHED), records audit logs, and dispatches alerts.
     *
     * @return Summary metrics of the scan iteration
     */
    SlaEscalationSummaryDto evaluateAndEscalateActiveSlas();

    /**
     * Calculates real-time SLA health metrics across all active jobs.
     *
     * @return SlaDashboardMetricsDto containing counts and compliance percentage
     */
    SlaDashboardMetricsDto getDashboardMetrics();
}
