package com.fieldpulse.service;

import com.fieldpulse.domain.entity.User;
import com.fieldpulse.dto.InventoryItemDto;
import com.fieldpulse.dto.inventory.InventoryAdjustmentDto;
import com.fieldpulse.dto.inventory.JobPartStatusDto;
import com.fieldpulse.dto.inventory.LowStockAlertDto;

import java.util.List;

public interface InventoryService {
    InventoryItemDto getItemById(Long id);
    InventoryItemDto getItemBySku(String sku);
    List<InventoryItemDto> getAllItems(String category);
    List<InventoryItemDto> getLowStockItems();
    List<LowStockAlertDto> getLowStockAlerts();

    List<JobPartStatusDto> reservePartsForJob(Long jobId, User caller);
    List<JobPartStatusDto> releasePartsForJob(Long jobId, User caller);
    List<JobPartStatusDto> consumePartsForJob(Long jobId, User caller);
    InventoryItemDto adjustStock(InventoryAdjustmentDto dto, User caller);
    List<JobPartStatusDto> getPartsForJob(Long jobId);
}
