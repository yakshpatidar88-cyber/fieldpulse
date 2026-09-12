package com.opsflow.domain.entity;

import com.opsflow.domain.enums.TechnicianStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "technicians")
public class Technician {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "employee_code", nullable = false, unique = true, length = 50)
    private String employeeCode;

    @Column(nullable = false, length = 30)
    private String phone;

    @Column(name = "base_latitude", nullable = false, precision = 10, scale = 7)
    private BigDecimal baseLatitude;

    @Column(name = "base_longitude", nullable = false, precision = 10, scale = 7)
    private BigDecimal baseLongitude;

    @Column(name = "current_latitude", nullable = false, precision = 10, scale = 7)
    private BigDecimal currentLatitude;

    @Column(name = "current_longitude", nullable = false, precision = 10, scale = 7)
    private BigDecimal currentLongitude;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TechnicianStatus status = TechnicianStatus.AVAILABLE;

    @Column(name = "max_concurrent_jobs", nullable = false)
    private Integer maxConcurrentJobs = 1;

    @Column(name = "active_jobs_count", nullable = false)
    private Integer activeJobsCount = 0;

    @Column(nullable = false, precision = 3, scale = 2)
    private BigDecimal rating = new BigDecimal("5.00");

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "technician_skills",
        joinColumns = @JoinColumn(name = "technician_id"),
        inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    private Set<Skill> skills = new HashSet<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public Technician() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

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

    public Set<Skill> getSkills() { return skills; }
    public void setSkills(Set<Skill> skills) { this.skills = skills; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public boolean canAcceptJob() {
        return status == TechnicianStatus.AVAILABLE && activeJobsCount < maxConcurrentJobs;
    }

    public boolean hasAllSkills(Set<Skill> requiredSkills) {
        if (requiredSkills == null || requiredSkills.isEmpty()) {
            return true;
        }
        return this.skills.containsAll(requiredSkills);
    }
}
