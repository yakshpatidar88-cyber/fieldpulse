package com.opsflow.service.impl;

import com.opsflow.domain.entity.InventoryItem;
import com.opsflow.dto.InventoryItemDto;
import com.opsflow.exception.ResourceNotFoundException;
import com.opsflow.repository.InventoryItemRepository;
import com.opsflow.service.InventoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InventoryServiceImpl implements InventoryService {

    private final InventoryItemRepository inventoryRepository;

    public InventoryServiceImpl(InventoryItemRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public InventoryItemDto getItemById(Long id) {
        return inventoryRepository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new ResourceNotFoundException("InventoryItem", "id", id));
    }

    @Override
    @Transactional(readOnly = true)
    public InventoryItemDto getItemBySku(String sku) {
        return inventoryRepository.findBySku(sku)
                .map(this::mapToDto)
                .orElseThrow(() -> new ResourceNotFoundException("InventoryItem", "sku", sku));
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryItemDto> getAllItems(String category) {
        List<InventoryItem> list = (category != null && !category.isBlank())
                ? inventoryRepository.findByCategory(category)
                : inventoryRepository.findAll();

        return list.stream().map(this::mapToDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryItemDto> getLowStockItems() {
        return inventoryRepository.findLowStockItems()
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    private InventoryItemDto mapToDto(InventoryItem item) {
        boolean isLowStock = item.getQuantityAvailable() <= item.getMinimumThreshold();
        return InventoryItemDto.builder()
                .id(item.getId())
                .sku(item.getSku())
                .name(item.getName())
                .description(item.getDescription())
                .category(item.getCategory())
                .unitPrice(item.getUnitPrice())
                .quantityAvailable(item.getQuantityAvailable())
                .quantityReserved(item.getQuantityReserved())
                .minimumThreshold(item.getMinimumThreshold())
                .warehouseLocation(item.getWarehouseLocation())
                .lowStock(isLowStock)
                .build();
    }
}
