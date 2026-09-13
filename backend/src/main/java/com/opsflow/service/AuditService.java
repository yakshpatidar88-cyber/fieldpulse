package com.opsflow.service;

import com.opsflow.domain.entity.User;
import com.opsflow.domain.enums.AuditAction;
import com.opsflow.dto.triage.AuditEventDto;

import java.util.List;

public interface AuditService {
    void logEvent(String entityName, Long entityId, AuditAction action, User performedBy, Object previousState, Object newState, Object metadata);
    List<AuditEventDto> getAuditTrail(String entityName, Long entityId);
}
