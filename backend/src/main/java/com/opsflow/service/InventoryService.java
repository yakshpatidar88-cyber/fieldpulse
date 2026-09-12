package com.opsflow.service;

import com.opsflow.dto.InventoryItemDto;

import java.util.List;

public interface InventoryService {
    InventoryItemDto getItemById(Long id);
    InventoryItemDto getItemBySku(String sku);
    List<InventoryItemDto> getAllItems(String category);
    List<InventoryItemDto> getLowStockItems();
}
