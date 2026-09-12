package com.opsflow.repository;

import com.opsflow.domain.entity.JobPart;
import com.opsflow.domain.enums.PartReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobPartRepository extends JpaRepository<JobPart, Long> {
    List<JobPart> findByJobId(Long jobId);
    List<JobPart> findByJobIdAndStatus(Long jobId, PartReservationStatus status);
    List<JobPart> findByInventoryItemId(Long inventoryItemId);
}
