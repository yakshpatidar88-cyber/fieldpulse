package com.opsflow.repository;

import com.opsflow.domain.entity.Sla;
import com.opsflow.domain.enums.SlaRiskLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface SlaRepository extends JpaRepository<Sla, Long> {
    Optional<Sla> findByJobId(Long jobId);
    List<Sla> findByRiskLevel(SlaRiskLevel riskLevel);

    @Query("SELECT s FROM Sla s WHERE s.resolvedAt IS NULL AND s.resolutionDeadline < :now AND s.riskLevel != 'BREACHED'")
    List<Sla> findNewlyBreachedSlas(@Param("now") Instant now);

    @Query("SELECT s FROM Sla s WHERE s.resolvedAt IS NULL AND s.riskLevel = 'HEALTHY' AND s.resolutionDeadline <= :warningThreshold")
    List<Sla> findApproachingSlas(@Param("warningThreshold") Instant warningThreshold);

    @Query("SELECT s FROM Sla s JOIN FETCH s.job j WHERE s.resolvedAt IS NULL AND j.status NOT IN (com.opsflow.domain.enums.JobStatus.COMPLETED, com.opsflow.domain.enums.JobStatus.CANCELLED)")
    List<Sla> findActiveUnresolvedSlas();
}
