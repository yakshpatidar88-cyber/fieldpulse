package com.opsflow.service;

import com.opsflow.domain.enums.TechnicianStatus;
import com.opsflow.dto.TechnicianDto;
import com.opsflow.dto.TechnicianStatusUpdateDto;
import com.opsflow.dto.TechnicianSummaryDto;

import java.util.List;

public interface TechnicianService {
    TechnicianDto getTechnicianById(Long id);
    List<TechnicianSummaryDto> getAllTechnicians(TechnicianStatus status);
    List<TechnicianSummaryDto> getAvailableTechnicians();
    TechnicianDto updateTechnicianStatus(Long id, TechnicianStatusUpdateDto dto);
}
