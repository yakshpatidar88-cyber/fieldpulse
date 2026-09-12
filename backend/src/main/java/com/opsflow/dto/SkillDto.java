package com.opsflow.dto;

public class SkillDto {
    private Long id;
    private String code;
    private String name;
    private String category;
    private String certificationLevel;
    private String description;

    public SkillDto() {}

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

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final SkillDto dto = new SkillDto();

        public Builder id(Long id) { dto.setId(id); return this; }
        public Builder code(String code) { dto.setCode(code); return this; }
        public Builder name(String name) { dto.setName(name); return this; }
        public Builder category(String category) { dto.setCategory(category); return this; }
        public Builder certificationLevel(String level) { dto.setCertificationLevel(level); return this; }
        public Builder description(String desc) { dto.setDescription(desc); return this; }
        public SkillDto build() { return dto; }
    }
}
