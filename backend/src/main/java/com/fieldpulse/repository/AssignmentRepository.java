package com.fieldpulse.repository;

import com.fieldpulse.domain.entity.Assignment;
import com.fieldpulse.domain.enums.AssignmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByJobId(Long jobId);
    List<Assignment> findByTechnicianId(Long technicianId);
    List<Assignment> findByJobIdAndStatus(Long jobId, AssignmentStatus status);
}
