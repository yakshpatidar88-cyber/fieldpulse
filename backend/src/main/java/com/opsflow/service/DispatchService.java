package com.opsflow.service;

import com.opsflow.domain.entity.User;
import com.opsflow.dto.dispatch.AssignmentDto;
import com.opsflow.dto.dispatch.ConfirmAssignmentDto;
import com.opsflow.dto.dispatch.DispatchRecommendationResponseDto;

import java.util.List;

public interface DispatchService {

    /**
     * Evaluates all candidate technicians for a target job and returns a ranked recommendation list.
     *
     * @param jobId ID of the target job
     * @param maxDistanceKm Optional maximum search radius filter in kilometers
     * @return DispatchRecommendationResponseDto with ranked candidates and score breakdowns
     */
    DispatchRecommendationResponseDto getRecommendations(Long jobId, Double maxDistanceKm);

    /**
     * Confirms technician assignment to a job, transitioning state and updating technician active load.
     *
     * @param dto Confirmation payload containing job ID and chosen technician ID
     * @param caller Authenticated dispatcher or admin user executing the dispatch
     * @return Created AssignmentDto
     */
    AssignmentDto confirmAssignment(ConfirmAssignmentDto dto, User caller);

    /**
     * Retrieves all assignments for a specific technician.
     *
     * @param technicianId ID of the technician
     * @return List of AssignmentDto
     */
    List<AssignmentDto> getAssignmentsForTechnician(Long technicianId);

    /**
     * Retrieves all assignment attempts and history for a specific job.
     *
     * @param jobId ID of the job
     * @return List of AssignmentDto
     */
    List<AssignmentDto> getAssignmentsForJob(Long jobId);
}
