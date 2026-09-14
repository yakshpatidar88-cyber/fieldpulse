package com.opsflow.service;

import com.opsflow.domain.entity.User;
import com.opsflow.dto.InventoryItemDto;
import com.opsflow.dto.inventory.InventoryAdjustmentDto;
import com.opsflow.dto.inventory.JobPartStatusDto;
import com.opsflow.dto.inventory.LowStockAlertDto;

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
