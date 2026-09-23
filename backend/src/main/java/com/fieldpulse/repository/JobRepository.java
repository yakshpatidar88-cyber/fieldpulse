package com.fieldpulse.repository;

import com.fieldpulse.domain.entity.Job;
import com.fieldpulse.domain.enums.JobPriority;
import com.fieldpulse.domain.enums.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    Optional<Job> findByJobNumber(String jobNumber);
    List<Job> findByStatus(JobStatus status);
    List<Job> findByStatusIn(List<JobStatus> statuses);
    List<Job> findByPriority(JobPriority priority);
    List<Job> findByAssignedTechnicianId(Long technicianId);

    @Query("SELECT j FROM Job j WHERE j.assignedTechnician.id = :technicianId AND j.status IN ('ASSIGNED', 'ACCEPTED', 'IN_PROGRESS')")
    List<Job> findActiveJobsForTechnician(@Param("technicianId") Long technicianId);
}
