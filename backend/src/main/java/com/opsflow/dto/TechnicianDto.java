package com.opsflow.dto;

import com.opsflow.domain.enums.TechnicianStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Set;

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

    public TechnicianDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getEmployeeCode() { return employeeCode; }
    public void setEmployeeCode(String employeeCode) { this.employeeCode = employeeCode; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public BigDecimal getBaseLatitude() { return baseLatitude; }
    public void setBaseLatitude(BigDecimal baseLatitude) { this.baseLatitude = baseLatitude; }

    public BigDecimal getBaseLongitude() { return baseLongitude; }
    public void setBaseLongitude(BigDecimal baseLongitude) { this.baseLongitude = baseLongitude; }

    public BigDecimal getCurrentLatitude() { return currentLatitude; }
    public void setCurrentLatitude(BigDecimal currentLatitude) { this.currentLatitude = currentLatitude; }

    public BigDecimal getCurrentLongitude() { return currentLongitude; }
    public void setCurrentLongitude(BigDecimal currentLongitude) { this.currentLongitude = currentLongitude; }

    public TechnicianStatus getStatus() { return status; }
    public void setStatus(TechnicianStatus status) { this.status = status; }

    public Integer getMaxConcurrentJobs() { return maxConcurrentJobs; }
    public void setMaxConcurrentJobs(Integer maxConcurrentJobs) { this.maxConcurrentJobs = maxConcurrentJobs; }

    public Integer getActiveJobsCount() { return activeJobsCount; }
    public void setActiveJobsCount(Integer activeJobsCount) { this.activeJobsCount = activeJobsCount; }

    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }

    public Set<SkillDto> getSkills() { return skills; }
    public void setSkills(Set<SkillDto> skills) { this.skills = skills; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final TechnicianDto dto = new TechnicianDto();

        public Builder id(Long id) { dto.setId(id); return this; }
        public Builder userId(Long userId) { dto.setUserId(userId); return this; }
        public Builder fullName(String name) { dto.setFullName(name); return this; }
        public Builder email(String email) { dto.setEmail(email); return this; }
        public Builder employeeCode(String code) { dto.setEmployeeCode(code); return this; }
        public Builder phone(String phone) { dto.setPhone(phone); return this; }
        public Builder baseLatitude(BigDecimal lat) { dto.setBaseLatitude(lat); return this; }
        public Builder baseLongitude(BigDecimal lng) { dto.setBaseLongitude(lng); return this; }
        public Builder currentLatitude(BigDecimal lat) { dto.setCurrentLatitude(lat); return this; }
        public Builder currentLongitude(BigDecimal lng) { dto.setCurrentLongitude(lng); return this; }
        public Builder status(TechnicianStatus status) { dto.setStatus(status); return this; }
        public Builder maxConcurrentJobs(Integer max) { dto.setMaxConcurrentJobs(max); return this; }
        public Builder activeJobsCount(Integer count) { dto.setActiveJobsCount(count); return this; }
        public Builder rating(BigDecimal rating) { dto.setRating(rating); return this; }
        public Builder skills(Set<SkillDto> skills) { dto.setSkills(skills); return this; }
        public Builder createdAt(Instant createdAt) { dto.setCreatedAt(createdAt); return this; }
        public TechnicianDto build() { return dto; }
    }
}
