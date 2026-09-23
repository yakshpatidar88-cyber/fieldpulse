package com.fieldpulse.scheduler;

import com.fieldpulse.dto.notification.SlaEscalationSummaryDto;
import com.fieldpulse.service.SlaEscalationEngine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class SlaMonitorScheduler {

    private static final Logger log = LoggerFactory.getLogger(SlaMonitorScheduler.class);

    private final SlaEscalationEngine escalationEngine;

    public SlaMonitorScheduler(SlaEscalationEngine escalationEngine) {
        this.escalationEngine = escalationEngine;
    }

    /**
     * Periodic background worker scanning active SLAs every 60 seconds (configurable).
     */
    @Scheduled(fixedRateString = "${fieldpulse.sla.polling-rate-ms:60000}", initialDelay = 10000)
    public void pollAndEscalateSlas() {
        try {
            log.debug("Starting periodic SLA escalation scan...");
            SlaEscalationSummaryDto summary = escalationEngine.evaluateAndEscalateActiveSlas();
            if (summary.getWarningsEscalated() > 0 || summary.getBreachesRecorded() > 0) {
                log.warn("SLA Polling Alert: {} warnings escalated, {} breaches recorded",
                        summary.getWarningsEscalated(), summary.getBreachesRecorded());
            }
        } catch (Exception ex) {
            log.error("Unhandled error during SLA background monitoring scan: {}", ex.getMessage(), ex);
        }
    }
}
