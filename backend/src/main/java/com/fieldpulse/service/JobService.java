package com.fieldpulse.service;

import com.fieldpulse.domain.entity.User;
import com.fieldpulse.domain.enums.JobPriority;
import com.fieldpulse.domain.enums.JobStatus;
import com.fieldpulse.dto.JobDto;
import com.fieldpulse.dto.JobSummaryDto;
import com.fieldpulse.dto.triage.JobStatusTransitionDto;

import java.util.List;

public interface JobService {
    JobDto getJobById(Long id);
    JobDto getJobByJobNumber(String jobNumber);
    List<JobSummaryDto> getAllJobs(JobStatus status, JobPriority priority);
    List<JobSummaryDto> getActiveJobsForTechnician(Long technicianId);
    JobDto transitionJobStatus(Long jobId, JobStatusTransitionDto transitionDto, User caller);
}
