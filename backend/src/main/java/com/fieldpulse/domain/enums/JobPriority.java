package com.fieldpulse.domain.enums;

public enum JobPriority {
    LOW(240, 1440, 1.0),      // 4 hrs response, 24 hrs resolution
    MEDIUM(120, 480, 1.2),    // 2 hrs response, 8 hrs resolution
    HIGH(60, 240, 1.5),       // 1 hr response, 4 hrs resolution
    CRITICAL(30, 120, 2.0);   // 30 mins response, 2 hrs resolution

    private final int defaultResponseMinutes;
    private final int defaultResolutionMinutes;
    private final double urgencyWeight;

    JobPriority(int defaultResponseMinutes, int defaultResolutionMinutes, double urgencyWeight) {
        this.defaultResponseMinutes = defaultResponseMinutes;
        this.defaultResolutionMinutes = defaultResolutionMinutes;
        this.urgencyWeight = urgencyWeight;
    }

    public int getDefaultResponseMinutes() {
        return defaultResponseMinutes;
    }

    public int getDefaultResolutionMinutes() {
        return defaultResolutionMinutes;
    }

    public double getUrgencyWeight() {
        return urgencyWeight;
    }
}
