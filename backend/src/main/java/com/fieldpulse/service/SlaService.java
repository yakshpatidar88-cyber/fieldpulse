package com.fieldpulse.service;

import com.fieldpulse.domain.entity.Job;
import com.fieldpulse.domain.entity.Sla;
import com.fieldpulse.dto.SlaDto;

import java.time.Instant;

public interface SlaService {
    Sla createSlaForJob(Job job);
    void evaluateRisk(Sla sla, Instant now);
    void recordResponse(Sla sla, Instant respondedAt);
    void recordResolution(Sla sla, Instant resolvedAt);
    SlaDto getSlaByJobId(Long jobId);
}
