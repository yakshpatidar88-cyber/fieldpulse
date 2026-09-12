package com.opsflow.dto;

import com.opsflow.domain.enums.JobPriority;
import com.opsflow.domain.enums.JobStatus;
import com.opsflow.domain.enums.SlaRiskLevel;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobSummaryDto {
    private Long id;
    private String jobNumber;
    private JobPriority priority;
    private JobStatus status;
    private String address;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Integer estimatedDurationMinutes;
    private String assignedTechnicianName;
    private Long assignedTechnicianId;
    private SlaRiskLevel slaRiskLevel;
    private Instant resolutionDeadline;
    private Instant createdAt;
}
