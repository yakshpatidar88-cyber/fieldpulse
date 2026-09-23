package com.fieldpulse.exception;

public class BusinessValidationException extends RuntimeException {
    public BusinessValidationException(String message) {
        super(message);
    }
}
