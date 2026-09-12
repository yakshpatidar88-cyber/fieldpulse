package com.opsflow.repository;

import com.opsflow.domain.entity.AuditEvent;
import com.opsflow.domain.enums.AuditAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditEventRepository extends JpaRepository<AuditEvent, Long> {
    List<AuditEvent> findByEntityNameAndEntityIdOrderByCreatedAtDesc(String entityName, Long entityId);
    List<AuditEvent> findByActionOrderByCreatedAtDesc(AuditAction action);
    List<AuditEvent> findByPerformedByIdOrderByCreatedAtDesc(Long userId);
}
