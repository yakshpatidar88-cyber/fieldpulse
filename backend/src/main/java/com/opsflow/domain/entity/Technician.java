package com.opsflow.domain.entity;

import com.opsflow.domain.enums.TechnicianStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "technicians")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TechnicianStatus status = TechnicianStatus.AVAILABLE;

    @Builder.Default
    @Column(name = "max_concurrent_jobs", nullable = false)
    private Integer maxConcurrentJobs = 1;

    @Builder.Default
    @Column(name = "active_jobs_count", nullable = false)
    private Integer activeJobsCount = 0;

    @Builder.Default
    @Column(nullable = false, precision = 3, scale = 2)
    private BigDecimal rating = new BigDecimal("5.00");

    @Builder.Default
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
