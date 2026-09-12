package com.opsflow.service;

import com.opsflow.domain.enums.JobPriority;
import com.opsflow.domain.enums.JobStatus;
import com.opsflow.dto.JobDto;
import com.opsflow.dto.JobSummaryDto;

import java.util.List;

public interface JobService {
    JobDto getJobById(Long id);
    JobDto getJobByJobNumber(String jobNumber);
    List<JobSummaryDto> getAllJobs(JobStatus status, JobPriority priority);
    List<JobSummaryDto> getActiveJobsForTechnician(Long technicianId);
}
