package com.fieldpulse.service.impl;

import com.fieldpulse.domain.entity.Job;
import com.fieldpulse.domain.entity.Sla;
import com.fieldpulse.domain.enums.JobPriority;
import com.fieldpulse.domain.enums.SlaRiskLevel;
import com.fieldpulse.dto.SlaDto;
import com.fieldpulse.exception.ResourceNotFoundException;
import com.fieldpulse.repository.SlaRepository;
import com.fieldpulse.service.SlaService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;

@Service
public class SlaServiceImpl implements SlaService {

    private final SlaRepository slaRepository;
    private final double warningThresholdPercent;

    public SlaServiceImpl(SlaRepository slaRepository,
                          @Value("${fieldpulse.sla.warning-threshold-percent:0.75}") double warningThresholdPercent) {
        this.slaRepository = slaRepository;
        this.warningThresholdPercent = warningThresholdPercent;
    }

    @Override
    @Transactional
    public Sla createSlaForJob(Job job) {
        JobPriority priority = job.getPriority() != null ? job.getPriority() : JobPriority.MEDIUM;
        Instant now = Instant.now();

        Instant responseDeadline = now.plus(Duration.ofMinutes(priority.getDefaultResponseMinutes()));
        Instant resolutionDeadline = now.plus(Duration.ofMinutes(priority.getDefaultResolutionMinutes()));

        Sla sla = new Sla();
        sla.setJob(job);
        sla.setResponseDeadline(responseDeadline);
        sla.setResolutionDeadline(resolutionDeadline);
        sla.setRiskLevel(SlaRiskLevel.HEALTHY);

        return slaRepository.save(sla);
    }

    @Override
    public void evaluateRisk(Sla sla, Instant now) {
        if (sla.getResolvedAt() != null) {
            sla.setRiskLevel(SlaRiskLevel.HEALTHY);
            return;
        }

        if (now.isAfter(sla.getResolutionDeadline())) {
            sla.setRiskLevel(SlaRiskLevel.BREACHED);
            if (sla.getBreachReason() == null) {
                sla.setBreachReason("Resolution deadline passed without job completion");
            }
            return;
        }

        Instant createdAt = sla.getCreatedAt() != null ? sla.getCreatedAt() : Instant.now();
        long totalWindowMillis = Duration.between(createdAt, sla.getResolutionDeadline()).toMillis();
        long elapsedMillis = Duration.between(createdAt, now).toMillis();

        if (totalWindowMillis > 0) {
            double percentElapsed = (double) elapsedMillis / totalWindowMillis;
            if (percentElapsed >= warningThresholdPercent) {
                sla.setRiskLevel(SlaRiskLevel.WARNING);
                return;
            }
        }

        sla.setRiskLevel(SlaRiskLevel.HEALTHY);
    }

    @Override
    @Transactional
    public void recordResponse(Sla sla, Instant respondedAt) {
        sla.setRespondedAt(respondedAt != null ? respondedAt : Instant.now());
        slaRepository.save(sla);
    }

    @Override
    @Transactional
    public void recordResolution(Sla sla, Instant resolvedAt) {
        sla.setResolvedAt(resolvedAt != null ? resolvedAt : Instant.now());
        evaluateRisk(sla, sla.getResolvedAt());
        slaRepository.save(sla);
    }

    @Override
    @Transactional(readOnly = true)
    public SlaDto getSlaByJobId(Long jobId) {
        return slaRepository.findByJobId(jobId)
                .map(this::mapToDto)
                .orElseThrow(() -> new ResourceNotFoundException("SLA", "jobId", jobId));
    }

    private SlaDto mapToDto(Sla sla) {
        return SlaDto.builder()
                .id(sla.getId())
                .jobId(sla.getJob() != null ? sla.getJob().getId() : null)
                .responseDeadline(sla.getResponseDeadline())
                .resolutionDeadline(sla.getResolutionDeadline())
                .respondedAt(sla.getRespondedAt())
                .resolvedAt(sla.getResolvedAt())
                .riskLevel(sla.getRiskLevel())
                .breachReason(sla.getBreachReason())
                .build();
    }
}
