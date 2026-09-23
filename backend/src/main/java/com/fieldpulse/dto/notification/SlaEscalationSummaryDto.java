package com.fieldpulse.dto.notification;

import java.time.Instant;

public class SlaEscalationSummaryDto {
    private int scannedCount;
    private int warningsEscalated;
    private int breachesRecorded;
    private long scanDurationMs;
    private Instant scannedAt;

    public SlaEscalationSummaryDto() {}

    public SlaEscalationSummaryDto(int scannedCount, int warningsEscalated, int breachesRecorded, long scanDurationMs, Instant scannedAt) {
        this.scannedCount = scannedCount;
        this.warningsEscalated = warningsEscalated;
        this.breachesRecorded = breachesRecorded;
        this.scanDurationMs = scanDurationMs;
        this.scannedAt = scannedAt;
    }

    public int getScannedCount() { return scannedCount; }
    public void setScannedCount(int scannedCount) { this.scannedCount = scannedCount; }

    public int getWarningsEscalated() { return warningsEscalated; }
    public void setWarningsEscalated(int warningsEscalated) { this.warningsEscalated = warningsEscalated; }

    public int getBreachesRecorded() { return breachesRecorded; }
    public void setBreachesRecorded(int breachesRecorded) { this.breachesRecorded = breachesRecorded; }

    public long getScanDurationMs() { return scanDurationMs; }
    public void setScanDurationMs(long scanDurationMs) { this.scanDurationMs = scanDurationMs; }

    public Instant getScannedAt() { return scannedAt; }
    public void setScannedAt(Instant scannedAt) { this.scannedAt = scannedAt; }
}
