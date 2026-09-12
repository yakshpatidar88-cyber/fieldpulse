package com.opsflow.domain.entity;

import jakarta.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "skills")
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(name = "certification_level", nullable = false, length = 50)
    private String certificationLevel = "STANDARD";

    @Column(columnDefinition = "TEXT")
    private String description;

    public Skill() {}

    public Skill(Long id, String code, String name, String category, String certificationLevel, String description) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.category = category;
        this.certificationLevel = certificationLevel;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getCertificationLevel() { return certificationLevel; }
    public void setCertificationLevel(String certificationLevel) { this.certificationLevel = certificationLevel; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Skill skill = (Skill) o;
        return Objects.equals(code, skill.code);
    }

    @Override
    public int hashCode() {
        return Objects.hash(code);
    }
}
