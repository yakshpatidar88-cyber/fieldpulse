package com.opsflow.exception;

public class InsufficientInventoryException extends RuntimeException {
    public InsufficientInventoryException(String message) {
        super(message);
    }

    public InsufficientInventoryException(String sku, int requested, int available) {
        super(String.format("Insufficient inventory for SKU '%s': requested %d, available %d", sku, requested, available));
    }
}
