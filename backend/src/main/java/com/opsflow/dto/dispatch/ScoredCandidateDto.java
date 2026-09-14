package com.opsflow.dto.dispatch;

import java.math.BigDecimal;
import java.util.Set;

public class ScoredCandidateDto {
    private Long technicianId;
    private String employeeCode;
    private String fullName;
    private String phone;
    private BigDecimal currentLatitude;
    private BigDecimal currentLongitude;
    private double distanceKm;
    private BigDecimal rating;
    private int activeJobsCount;
    private int maxConcurrentJobs;
    private boolean eligible;
    private String disqualificationReason;
    private Set<String> matchedSkills;
    private Set<String> missingSkills;
    private ScoreBreakdownDto scoreBreakdown;
    private double totalScore;

    public ScoredCandidateDto() {}

    public Long getTechnicianId() { return technicianId; }
    public void setTechnicianId(Long technicianId) { this.technicianId = technicianId; }

    public String getEmployeeCode() { return employeeCode; }
    public void setEmployeeCode(String employeeCode) { this.employeeCode = employeeCode; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public BigDecimal getCurrentLatitude() { return currentLatitude; }
    public void setCurrentLatitude(BigDecimal currentLatitude) { this.currentLatitude = currentLatitude; }

    public BigDecimal getCurrentLongitude() { return currentLongitude; }
    public void setCurrentLongitude(BigDecimal currentLongitude) { this.currentLongitude = currentLongitude; }

    public double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(double distanceKm) { this.distanceKm = distanceKm; }

    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }

    public int getActiveJobsCount() { return activeJobsCount; }
    public void setActiveJobsCount(int activeJobsCount) { this.activeJobsCount = activeJobsCount; }

    public int getMaxConcurrentJobs() { return maxConcurrentJobs; }
    public void setMaxConcurrentJobs(int maxConcurrentJobs) { this.maxConcurrentJobs = maxConcurrentJobs; }

    public boolean isEligible() { return eligible; }
    public void setEligible(boolean eligible) { this.eligible = eligible; }

    public String getDisqualificationReason() { return disqualificationReason; }
    public void setDisqualificationReason(String disqualificationReason) { this.disqualificationReason = disqualificationReason; }

    public Set<String> getMatchedSkills() { return matchedSkills; }
    public void setMatchedSkills(Set<String> matchedSkills) { this.matchedSkills = matchedSkills; }

    public Set<String> getMissingSkills() { return missingSkills; }
    public void setMissingSkills(Set<String> missingSkills) { this.missingSkills = missingSkills; }

    public ScoreBreakdownDto getScoreBreakdown() { return scoreBreakdown; }
    public void setScoreBreakdown(ScoreBreakdownDto scoreBreakdown) { this.scoreBreakdown = scoreBreakdown; }

    public double getTotalScore() { return totalScore; }
    public void setTotalScore(double totalScore) { this.totalScore = totalScore; }
}
