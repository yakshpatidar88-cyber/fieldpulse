package com.opsflow.dto;

import com.opsflow.domain.enums.TechnicianStatus;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TechnicianSummaryDto {
    private Long id;
    private String fullName;
    private String employeeCode;
    private TechnicianStatus status;
    private Integer activeJobsCount;
    private Integer maxConcurrentJobs;
    private BigDecimal rating;
    private BigDecimal currentLatitude;
    private BigDecimal currentLongitude;
}
