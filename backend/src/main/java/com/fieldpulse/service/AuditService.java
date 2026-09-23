package com.fieldpulse.service;

import com.fieldpulse.domain.entity.User;
import com.fieldpulse.domain.enums.AuditAction;
import com.fieldpulse.dto.triage.AuditEventDto;

import java.util.List;

public interface AuditService {
    void logEvent(String entityName, Long entityId, AuditAction action, User performedBy, Object previousState, Object newState, Object metadata);
    List<AuditEventDto> getAuditTrail(String entityName, Long entityId);
}
