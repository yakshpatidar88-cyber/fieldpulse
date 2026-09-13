package com.opsflow.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.opsflow.domain.entity.AuditEvent;
import com.opsflow.domain.entity.User;
import com.opsflow.domain.enums.AuditAction;
import com.opsflow.dto.triage.AuditEventDto;
import com.opsflow.repository.AuditEventRepository;
import com.opsflow.service.AuditService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AuditServiceImpl implements AuditService {

    private static final Logger log = LoggerFactory.getLogger(AuditServiceImpl.class);

    private final AuditEventRepository auditRepository;
    private final ObjectMapper objectMapper;

    public AuditServiceImpl(AuditEventRepository auditRepository, ObjectMapper objectMapper) {
        this.auditRepository = auditRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional
    public void logEvent(String entityName,
                         Long entityId,
                         AuditAction action,
                         User performedBy,
                         Object previousState,
                         Object newState,
                         Object metadata) {
        try {
            AuditEvent event = new AuditEvent();
            event.setEntityName(entityName);
            event.setEntityId(entityId);
            event.setAction(action);
            event.setPerformedBy(performedBy);

            if (previousState != null) {
                event.setPreviousState(previousState instanceof String s ? s : objectMapper.writeValueAsString(previousState));
            }
            if (newState != null) {
                event.setNewState(newState instanceof String s ? s : objectMapper.writeValueAsString(newState));
            }
            if (metadata != null) {
                event.setMetadata(metadata instanceof String s ? s : objectMapper.writeValueAsString(metadata));
            }

            auditRepository.save(event);
        } catch (Exception ex) {
            log.error("Failed to persist audit event for {}:{}", entityName, entityId, ex);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditEventDto> getAuditTrail(String entityName, Long entityId) {
        return auditRepository.findByEntityNameAndEntityIdOrderByCreatedAtDesc(entityName, entityId)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    private AuditEventDto mapToDto(AuditEvent event) {
        String performedByEmail = (event.getPerformedBy() != null) ? event.getPerformedBy().getEmail() : "SYSTEM";

        return AuditEventDto.builder()
                .id(event.getId())
                .entityName(event.getEntityName())
                .entityId(event.getEntityId())
                .action(event.getAction())
                .performedByEmail(performedByEmail)
                .previousState(event.getPreviousState())
                .newState(event.getNewState())
                .metadata(event.getMetadata())
                .createdAt(event.getCreatedAt())
                .build();
    }
}
