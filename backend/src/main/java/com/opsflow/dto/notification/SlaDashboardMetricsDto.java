package com.opsflow.dto.notification;

public class SlaDashboardMetricsDto {
    private long totalActiveJobs;
    private long healthyCount;
    private long warningCount;
    private long breachedCount;
    private double complianceRatePercent;

    public SlaDashboardMetricsDto() {}

    public SlaDashboardMetricsDto(long totalActiveJobs, long healthyCount, long warningCount, long breachedCount, double complianceRatePercent) {
        this.totalActiveJobs = totalActiveJobs;
        this.healthyCount = healthyCount;
        this.warningCount = warningCount;
        this.breachedCount = breachedCount;
        this.complianceRatePercent = complianceRatePercent;
    }

    public long getTotalActiveJobs() { return totalActiveJobs; }
    public void setTotalActiveJobs(long totalActiveJobs) { this.totalActiveJobs = totalActiveJobs; }

    public long getHealthyCount() { return healthyCount; }
    public void setHealthyCount(long healthyCount) { this.healthyCount = healthyCount; }

    public long getWarningCount() { return warningCount; }
    public void setWarningCount(long warningCount) { this.warningCount = warningCount; }

    public long getBreachedCount() { return breachedCount; }
    public void setBreachedCount(long breachedCount) { this.breachedCount = breachedCount; }

    public double getComplianceRatePercent() { return complianceRatePercent; }
    public void setComplianceRatePercent(double complianceRatePercent) { this.complianceRatePercent = complianceRatePercent; }
}
