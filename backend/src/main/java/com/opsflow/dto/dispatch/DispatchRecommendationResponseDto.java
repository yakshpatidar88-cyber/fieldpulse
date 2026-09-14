package com.opsflow.dto.dispatch;

import com.opsflow.domain.enums.JobPriority;
import com.opsflow.domain.enums.JobStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class DispatchRecommendationResponseDto {
    private Long jobId;
    private String jobNumber;
    private String title;
    private JobPriority priority;
    private JobStatus status;
    private String address;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Instant scheduledStartTime;
    private Set<String> requiredSkills = new HashSet<>();
    private List<ScoredCandidateDto> recommendations = new ArrayList<>();
    private int totalCandidatesEvaluated;
    private int eligibleCandidatesCount;

    public DispatchRecommendationResponseDto() {}

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public String getJobNumber() { return jobNumber; }
    public void setJobNumber(String jobNumber) { this.jobNumber = jobNumber; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public JobPriority getPriority() { return priority; }
    public void setPriority(JobPriority priority) { this.priority = priority; }

    public JobStatus getStatus() { return status; }
    public void setStatus(JobStatus status) { this.status = status; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }

    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }

    public Instant getScheduledStartTime() { return scheduledStartTime; }
    public void setScheduledStartTime(Instant scheduledStartTime) { this.scheduledStartTime = scheduledStartTime; }

    public Set<String> getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(Set<String> requiredSkills) { this.requiredSkills = requiredSkills; }

    public List<ScoredCandidateDto> getRecommendations() { return recommendations; }
    public void setRecommendations(List<ScoredCandidateDto> recommendations) { this.recommendations = recommendations; }

    public int getTotalCandidatesEvaluated() { return totalCandidatesEvaluated; }
    public void setTotalCandidatesEvaluated(int totalCandidatesEvaluated) { this.totalCandidatesEvaluated = totalCandidatesEvaluated; }

    public int getEligibleCandidatesCount() { return eligibleCandidatesCount; }
    public void setEligibleCandidatesCount(int eligibleCandidatesCount) { this.eligibleCandidatesCount = eligibleCandidatesCount; }
}
