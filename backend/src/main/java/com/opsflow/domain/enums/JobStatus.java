package com.opsflow.domain.enums;

import java.util.Set;

public enum JobStatus {
    CREATED,
    TRIAGED,
    ASSIGNED,
    ACCEPTED,
    IN_PROGRESS,
    COMPLETED,
    CANCELLED;

    public boolean canTransitionTo(JobStatus next) {
        if (this == next) {
            return true;
        }
        if (this == COMPLETED || this == CANCELLED) {
            return false;
        }
        if (next == CANCELLED) {
            return true;
        }

        return switch (this) {
            case CREATED -> next == TRIAGED;
            case TRIAGED -> next == ASSIGNED;
            case ASSIGNED -> next == ACCEPTED || next == TRIAGED; // can be re-triaged if rejected
            case ACCEPTED -> next == IN_PROGRESS;
            case IN_PROGRESS -> next == COMPLETED;
            default -> false;
        };
    }
}
