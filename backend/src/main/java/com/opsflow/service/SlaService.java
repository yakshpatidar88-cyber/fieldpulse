package com.opsflow.service;

import com.opsflow.domain.entity.Job;
import com.opsflow.domain.entity.Sla;
import com.opsflow.dto.SlaDto;

import java.time.Instant;

public interface SlaService {
    Sla createSlaForJob(Job job);
    void evaluateRisk(Sla sla, Instant now);
    void recordResponse(Sla sla, Instant respondedAt);
    void recordResolution(Sla sla, Instant resolvedAt);
    SlaDto getSlaByJobId(Long jobId);
}
