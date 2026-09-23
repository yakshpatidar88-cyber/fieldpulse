package com.fieldpulse.dto.auth;

import com.fieldpulse.dto.TechnicianSummaryDto;

import java.time.Instant;
import java.util.Set;

public class UserProfileDto {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String fullName;
    private Set<String> roles;
    private TechnicianSummaryDto technicianProfile;
    private Instant createdAt;

    public UserProfileDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }

    public TechnicianSummaryDto getTechnicianProfile() { return technicianProfile; }
    public void setTechnicianProfile(TechnicianSummaryDto technicianProfile) { this.technicianProfile = technicianProfile; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final UserProfileDto dto = new UserProfileDto();

        public Builder id(Long id) { dto.setId(id); return this; }
        public Builder email(String email) { dto.setEmail(email); return this; }
        public Builder firstName(String firstName) { dto.setFirstName(firstName); return this; }
        public Builder lastName(String lastName) { dto.setLastName(lastName); return this; }
        public Builder fullName(String fullName) { dto.setFullName(fullName); return this; }
        public Builder roles(Set<String> roles) { dto.setRoles(roles); return this; }
        public Builder technicianProfile(TechnicianSummaryDto tech) { dto.setTechnicianProfile(tech); return this; }
        public Builder createdAt(Instant createdAt) { dto.setCreatedAt(createdAt); return this; }
        public UserProfileDto build() { return dto; }
    }
}
