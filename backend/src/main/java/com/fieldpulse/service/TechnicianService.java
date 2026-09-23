package com.fieldpulse.service;

import com.fieldpulse.domain.enums.TechnicianStatus;
import com.fieldpulse.dto.TechnicianDto;
import com.fieldpulse.dto.TechnicianStatusUpdateDto;
import com.fieldpulse.dto.TechnicianSummaryDto;

import java.util.List;

public interface TechnicianService {
    TechnicianDto getTechnicianById(Long id);
    List<TechnicianSummaryDto> getAllTechnicians(TechnicianStatus status);
    List<TechnicianSummaryDto> getAvailableTechnicians();
    TechnicianDto updateTechnicianStatus(Long id, TechnicianStatusUpdateDto dto);
}
