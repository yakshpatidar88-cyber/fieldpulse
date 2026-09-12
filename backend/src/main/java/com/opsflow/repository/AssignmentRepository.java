package com.opsflow.repository;

import com.opsflow.domain.entity.Assignment;
import com.opsflow.domain.enums.AssignmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByJobId(Long jobId);
    List<Assignment> findByTechnicianId(Long technicianId);
    List<Assignment> findByJobIdAndStatus(Long jobId, AssignmentStatus status);
}
