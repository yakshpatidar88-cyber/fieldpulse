package com.opsflow.service;

import com.opsflow.domain.entity.Job;
import com.opsflow.domain.entity.Technician;
import com.opsflow.dto.dispatch.ScoredCandidateDto;

public interface DispatchScoringEngine {

    double WEIGHT_SKILL = 0.35;
    double WEIGHT_DISTANCE = 0.25;
    double WEIGHT_WORKLOAD = 0.20;
    double WEIGHT_SLA = 0.20;

    /**
     * Evaluates a technician candidate for a job against both hard constraints and soft scoring criteria.
     *
     * @param job Target field service job
     * @param technician Candidate field technician
     * @return ScoredCandidateDto containing qualification status, individual factor scores, and total weighted score
     */
    ScoredCandidateDto evaluateCandidate(Job job, Technician technician);
}
