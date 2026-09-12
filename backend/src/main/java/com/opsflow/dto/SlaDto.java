package com.opsflow.dto;

import com.opsflow.domain.enums.SlaRiskLevel;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SlaDto {
    private Long id;
    private Long jobId;
    private Instant responseDeadline;
    private Instant resolutionDeadline;
    private Instant respondedAt;
    private Instant resolvedAt;
    private SlaRiskLevel riskLevel;
    private String breachReason;
}
