package com.opsflow.repository;

import com.opsflow.domain.entity.ServiceRequest;
import com.opsflow.domain.enums.JobPriority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {
    List<ServiceRequest> findByStatus(String status);
    List<ServiceRequest> findByPriority(JobPriority priority);
}
