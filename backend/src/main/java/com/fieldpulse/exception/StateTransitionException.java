package com.fieldpulse.exception;

public class StateTransitionException extends RuntimeException {
    public StateTransitionException(String message) {
        super(message);
    }

    public StateTransitionException(String entityName, String currentStatus, String targetStatus) {
        super(String.format("Invalid state transition for %s: cannot move from %s to %s", entityName, currentStatus, targetStatus));
    }
}
