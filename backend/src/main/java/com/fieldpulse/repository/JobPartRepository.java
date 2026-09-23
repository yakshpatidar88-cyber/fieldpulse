package com.fieldpulse.repository;

import com.fieldpulse.domain.entity.JobPart;
import com.fieldpulse.domain.enums.PartReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobPartRepository extends JpaRepository<JobPart, Long> {
    List<JobPart> findByJobId(Long jobId);
    List<JobPart> findByJobIdAndStatus(Long jobId, PartReservationStatus status);
    List<JobPart> findByInventoryItemId(Long inventoryItemId);
}
