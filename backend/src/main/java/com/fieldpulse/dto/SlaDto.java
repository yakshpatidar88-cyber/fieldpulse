package com.fieldpulse.dto;

import com.fieldpulse.domain.enums.SlaRiskLevel;
import java.time.Instant;

public class SlaDto {
    private Long id;
    private Long jobId;
    private Instant responseDeadline;
    private Instant resolutionDeadline;
    private Instant respondedAt;
    private Instant resolvedAt;
    private SlaRiskLevel riskLevel;
    private String breachReason;

    public SlaDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public Instant getResponseDeadline() { return responseDeadline; }
    public void setResponseDeadline(Instant responseDeadline) { this.responseDeadline = responseDeadline; }

    public Instant getResolutionDeadline() { return resolutionDeadline; }
    public void setResolutionDeadline(Instant resolutionDeadline) { this.resolutionDeadline = resolutionDeadline; }

    public Instant getRespondedAt() { return respondedAt; }
    public void setRespondedAt(Instant respondedAt) { this.respondedAt = respondedAt; }

    public Instant getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(Instant resolvedAt) { this.resolvedAt = resolvedAt; }

    public SlaRiskLevel getRiskLevel() { return riskLevel; }
    public void setRiskLevel(SlaRiskLevel riskLevel) { this.riskLevel = riskLevel; }

    public String getBreachReason() { return breachReason; }
    public void setBreachReason(String breachReason) { this.breachReason = breachReason; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final SlaDto dto = new SlaDto();

        public Builder id(Long id) { dto.setId(id); return this; }
        public Builder jobId(Long jobId) { dto.setJobId(jobId); return this; }
        public Builder responseDeadline(Instant time) { dto.setResponseDeadline(time); return this; }
        public Builder resolutionDeadline(Instant time) { dto.setResolutionDeadline(time); return this; }
        public Builder respondedAt(Instant time) { dto.setRespondedAt(time); return this; }
        public Builder resolvedAt(Instant time) { dto.setResolvedAt(time); return this; }
        public Builder riskLevel(SlaRiskLevel level) { dto.setRiskLevel(level); return this; }
        public Builder breachReason(String reason) { dto.setBreachReason(reason); return this; }
        public SlaDto build() { return dto; }
    }
}
