package com.fieldpulse.dto.triage;

import com.fieldpulse.domain.enums.AuditAction;

import java.time.Instant;

public class AuditEventDto {
    private Long id;
    private String entityName;
    private Long entityId;
    private AuditAction action;
    private String performedByEmail;
    private String previousState;
    private String newState;
    private String metadata;
    private Instant createdAt;

    public AuditEventDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEntityName() { return entityName; }
    public void setEntityName(String entityName) { this.entityName = entityName; }

    public Long getEntityId() { return entityId; }
    public void setEntityId(Long entityId) { this.entityId = entityId; }

    public AuditAction getAction() { return action; }
    public void setAction(AuditAction action) { this.action = action; }

    public String getPerformedByEmail() { return performedByEmail; }
    public void setPerformedByEmail(String performedByEmail) { this.performedByEmail = performedByEmail; }

    public String getPreviousState() { return previousState; }
    public void setPreviousState(String previousState) { this.previousState = previousState; }

    public String getNewState() { return newState; }
    public void setNewState(String newState) { this.newState = newState; }

    public String getMetadata() { return metadata; }
    public void setMetadata(String metadata) { this.metadata = metadata; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final AuditEventDto dto = new AuditEventDto();

        public Builder id(Long id) { dto.setId(id); return this; }
        public Builder entityName(String name) { dto.setEntityName(name); return this; }
        public Builder entityId(Long id) { dto.setEntityId(id); return this; }
        public Builder action(AuditAction action) { dto.setAction(action); return this; }
        public Builder performedByEmail(String email) { dto.setPerformedByEmail(email); return this; }
        public Builder previousState(String prev) { dto.setPreviousState(prev); return this; }
        public Builder newState(String next) { dto.setNewState(next); return this; }
        public Builder metadata(String meta) { dto.setMetadata(meta); return this; }
        public Builder createdAt(Instant time) { dto.setCreatedAt(time); return this; }
        public AuditEventDto build() { return dto; }
    }
}
