package com.opsflow.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillDto {
    private Long id;
    private String code;
    private String name;
    private String category;
    private String certificationLevel;
    private String description;
}
