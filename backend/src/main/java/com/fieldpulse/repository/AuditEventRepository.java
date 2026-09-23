package com.fieldpulse.repository;

import com.fieldpulse.domain.entity.AuditEvent;
import com.fieldpulse.domain.enums.AuditAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditEventRepository extends JpaRepository<AuditEvent, Long> {
    List<AuditEvent> findByEntityNameAndEntityIdOrderByCreatedAtDesc(String entityName, Long entityId);
    List<AuditEvent> findByActionOrderByCreatedAtDesc(AuditAction action);
    List<AuditEvent> findByPerformedByIdOrderByCreatedAtDesc(Long userId);
}
