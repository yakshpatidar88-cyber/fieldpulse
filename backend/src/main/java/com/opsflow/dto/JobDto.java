package com.opsflow.dto;

import com.opsflow.domain.enums.JobPriority;
import com.opsflow.domain.enums.JobStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobDto {
    private Long id;
    private String jobNumber;
    private Long serviceRequestId;
    private JobPriority priority;
    private JobStatus status;
    private String address;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Integer estimatedDurationMinutes;
    private Instant scheduledStartTime;
    private Instant actualStartTime;
    private Instant completedAt;
    private String completionNotes;
    private TechnicianSummaryDto assignedTechnician;
    private Set<SkillDto> requiredSkills;
    private SlaDto sla;
    private List<JobPartDto> parts;
    private Instant createdAt;
    private Instant updatedAt;
}
