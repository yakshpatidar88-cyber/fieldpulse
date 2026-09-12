package com.opsflow.repository;

import com.opsflow.domain.entity.Technician;
import com.opsflow.domain.enums.TechnicianStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TechnicianRepository extends JpaRepository<Technician, Long> {
    Optional<Technician> findByEmployeeCode(String employeeCode);
    Optional<Technician> findByUserId(Long userId);
    List<Technician> findByStatus(TechnicianStatus status);

    @Query("SELECT t FROM Technician t WHERE t.status = :status AND t.activeJobsCount < t.maxConcurrentJobs")
    List<Technician> findAvailableTechnicians(@Param("status") TechnicianStatus status);
}
