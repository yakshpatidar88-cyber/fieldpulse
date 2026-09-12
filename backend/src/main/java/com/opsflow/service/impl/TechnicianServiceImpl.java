package com.opsflow.service.impl;

import com.opsflow.domain.entity.Skill;
import com.opsflow.domain.entity.Technician;
import com.opsflow.domain.enums.TechnicianStatus;
import com.opsflow.dto.SkillDto;
import com.opsflow.dto.TechnicianDto;
import com.opsflow.dto.TechnicianStatusUpdateDto;
import com.opsflow.dto.TechnicianSummaryDto;
import com.opsflow.exception.ResourceNotFoundException;
import com.opsflow.repository.TechnicianRepository;
import com.opsflow.service.TechnicianService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TechnicianServiceImpl implements TechnicianService {

    private final TechnicianRepository technicianRepository;

    public TechnicianServiceImpl(TechnicianRepository technicianRepository) {
        this.technicianRepository = technicianRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public TechnicianDto getTechnicianById(Long id) {
        return technicianRepository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new ResourceNotFoundException("Technician", "id", id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TechnicianSummaryDto> getAllTechnicians(TechnicianStatus status) {
        List<Technician> list = (status != null)
                ? technicianRepository.findByStatus(status)
                : technicianRepository.findAll();

        return list.stream().map(this::mapToSummaryDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TechnicianSummaryDto> getAvailableTechnicians() {
        return technicianRepository.findAvailableTechnicians(TechnicianStatus.AVAILABLE)
                .stream()
                .map(this::mapToSummaryDto)
                .toList();
    }

    @Override
    @Transactional
    public TechnicianDto updateTechnicianStatus(Long id, TechnicianStatusUpdateDto dto) {
        Technician technician = technicianRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Technician", "id", id));

        technician.setStatus(dto.getStatus());
        if (dto.getCurrentLatitude() != null && dto.getCurrentLongitude() != null) {
            technician.setCurrentLatitude(dto.getCurrentLatitude());
            technician.setCurrentLongitude(dto.getCurrentLongitude());
        }

        Technician saved = technicianRepository.save(technician);
        return mapToDto(saved);
    }

    private TechnicianSummaryDto mapToSummaryDto(Technician tech) {
        String fullName = (tech.getUser() != null)
                ? tech.getUser().getFirstName() + " " + tech.getUser().getLastName()
                : tech.getEmployeeCode();

        return TechnicianSummaryDto.builder()
                .id(tech.getId())
                .fullName(fullName)
                .employeeCode(tech.getEmployeeCode())
                .status(tech.getStatus())
                .activeJobsCount(tech.getActiveJobsCount())
                .maxConcurrentJobs(tech.getMaxConcurrentJobs())
                .rating(tech.getRating())
                .currentLatitude(tech.getCurrentLatitude())
                .currentLongitude(tech.getCurrentLongitude())
                .build();
    }

    private TechnicianDto mapToDto(Technician tech) {
        String fullName = (tech.getUser() != null)
                ? tech.getUser().getFirstName() + " " + tech.getUser().getLastName()
                : tech.getEmployeeCode();

        String email = (tech.getUser() != null) ? tech.getUser().getEmail() : null;
        Long userId = (tech.getUser() != null) ? tech.getUser().getId() : null;

        Set<SkillDto> skillDtos = tech.getSkills().stream()
                .map(this::mapSkillDto)
                .collect(Collectors.toSet());

        return TechnicianDto.builder()
                .id(tech.getId())
                .userId(userId)
                .fullName(fullName)
                .email(email)
                .employeeCode(tech.getEmployeeCode())
                .phone(tech.getPhone())
                .baseLatitude(tech.getBaseLatitude())
                .baseLongitude(tech.getBaseLongitude())
                .currentLatitude(tech.getCurrentLatitude())
                .currentLongitude(tech.getCurrentLongitude())
                .status(tech.getStatus())
                .maxConcurrentJobs(tech.getMaxConcurrentJobs())
                .activeJobsCount(tech.getActiveJobsCount())
                .rating(tech.getRating())
                .skills(skillDtos)
                .createdAt(tech.getCreatedAt())
                .build();
    }

    private SkillDto mapSkillDto(Skill skill) {
        return SkillDto.builder()
                .id(skill.getId())
                .code(skill.getCode())
                .name(skill.getName())
                .category(skill.getCategory())
                .certificationLevel(skill.getCertificationLevel())
                .description(skill.getDescription())
                .build();
    }
}
