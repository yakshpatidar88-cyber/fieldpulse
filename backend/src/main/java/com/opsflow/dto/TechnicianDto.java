package com.opsflow.dto;

import com.opsflow.domain.enums.TechnicianStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TechnicianDto {
    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String employeeCode;
    private String phone;
    private BigDecimal baseLatitude;
    private BigDecimal baseLongitude;
    private BigDecimal currentLatitude;
    private BigDecimal currentLongitude;
    private TechnicianStatus status;
    private Integer maxConcurrentJobs;
    private Integer activeJobsCount;
    private BigDecimal rating;
    private Set<SkillDto> skills;
    private Instant createdAt;
}
