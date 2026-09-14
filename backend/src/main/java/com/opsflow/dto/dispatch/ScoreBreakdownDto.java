package com.opsflow.dto.dispatch;

public class ScoreBreakdownDto {
    private double skillScore;
    private double distanceScore;
    private double workloadScore;
    private double slaScore;
    private double weightedTotal;
    private String details;

    public ScoreBreakdownDto() {}

    public ScoreBreakdownDto(double skillScore, double distanceScore, double workloadScore, double slaScore, double weightedTotal, String details) {
        this.skillScore = skillScore;
        this.distanceScore = distanceScore;
        this.workloadScore = workloadScore;
        this.slaScore = slaScore;
        this.weightedTotal = weightedTotal;
        this.details = details;
    }

    public double getSkillScore() { return skillScore; }
    public void setSkillScore(double skillScore) { this.skillScore = skillScore; }

    public double getDistanceScore() { return distanceScore; }
    public void setDistanceScore(double distanceScore) { this.distanceScore = distanceScore; }

    public double getWorkloadScore() { return workloadScore; }
    public void setWorkloadScore(double workloadScore) { this.workloadScore = workloadScore; }

    public double getSlaScore() { return slaScore; }
    public void setSlaScore(double slaScore) { this.slaScore = slaScore; }

    public double getWeightedTotal() { return weightedTotal; }
    public void setWeightedTotal(double weightedTotal) { this.weightedTotal = weightedTotal; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
}
