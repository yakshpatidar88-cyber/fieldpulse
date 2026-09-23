package com.fieldpulse.service.impl;

import com.fieldpulse.domain.entity.InventoryItem;
import com.fieldpulse.domain.entity.Job;
import com.fieldpulse.domain.entity.JobPart;
import com.fieldpulse.domain.entity.User;
import com.fieldpulse.domain.enums.AuditAction;
import com.fieldpulse.domain.enums.PartReservationStatus;
import com.fieldpulse.dto.InventoryItemDto;
import com.fieldpulse.dto.inventory.InventoryAdjustmentDto;
import com.fieldpulse.dto.inventory.JobPartStatusDto;
import com.fieldpulse.dto.inventory.LowStockAlertDto;
import com.fieldpulse.exception.BusinessValidationException;
import com.fieldpulse.exception.InsufficientInventoryException;
import com.fieldpulse.exception.ResourceNotFoundException;
import com.fieldpulse.repository.InventoryItemRepository;
import com.fieldpulse.repository.JobPartRepository;
import com.fieldpulse.repository.JobRepository;
import com.fieldpulse.service.AuditService;
import com.fieldpulse.service.InventoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class InventoryServiceImpl implements InventoryService {

    private final InventoryItemRepository inventoryRepository;
    private final JobPartRepository jobPartRepository;
    private final JobRepository jobRepository;
    private final AuditService auditService;

    public InventoryServiceImpl(
            InventoryItemRepository inventoryRepository,
            JobPartRepository jobPartRepository,
            JobRepository jobRepository,
            AuditService auditService) {
        this.inventoryRepository = inventoryRepository;
        this.jobPartRepository = jobPartRepository;
        this.jobRepository = jobRepository;
        this.auditService = auditService;
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

    @Override
    @Transactional(readOnly = true)
    public List<LowStockAlertDto> getLowStockAlerts() {
        return inventoryRepository.findLowStockItems()
                .stream()
                .map(this::mapToAlertDto)
                .toList();
    }

    @Override
    @Transactional
    public List<JobPartStatusDto> reservePartsForJob(Long jobId, User caller) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        List<JobPart> parts = jobPartRepository.findByJobId(jobId);
        if (parts.isEmpty()) {
            return List.of();
        }

        List<JobPartStatusDto> results = new ArrayList<>();
        Instant now = Instant.now();

        for (JobPart part : parts) {
            if (part.getStatus() == PartReservationStatus.RESERVED || part.getStatus() == PartReservationStatus.CONSUMED) {
                results.add(mapToJobPartDto(part, job.getJobNumber()));
                continue;
            }

            // Pessimistic write lock on inventory row
            InventoryItem item = inventoryRepository.findByIdWithPessimisticLock(part.getInventoryItem().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("InventoryItem", "id", part.getInventoryItem().getId()));

            if (item.getQuantityAvailable() < part.getQuantityRequired()) {
                throw new InsufficientInventoryException(
                        item.getSku(),
                        part.getQuantityRequired(),
                        item.getQuantityAvailable()
                );
            }

            int oldAvailable = item.getQuantityAvailable();
            int oldReserved = item.getQuantityReserved();

            // Mutate inventory counts
            item.setQuantityAvailable(oldAvailable - part.getQuantityRequired());
            item.setQuantityReserved(oldReserved + part.getQuantityRequired());
            inventoryRepository.save(item);

            // Update part reservation status
            part.setStatus(PartReservationStatus.RESERVED);
            part.setReservedAt(now);
            JobPart savedPart = jobPartRepository.save(part);

            // Immutable Audit Log
            auditService.logEvent(
                    "InventoryItem",
                    item.getId(),
                    AuditAction.INVENTORY_RESERVED,
                    caller,
                    String.format("Available: %d, Reserved: %d", oldAvailable, oldReserved),
                    String.format("Available: %d, Reserved: %d", item.getQuantityAvailable(), item.getQuantityReserved()),
                    Map.of(
                            "jobId", jobId.toString(),
                            "jobNumber", job.getJobNumber(),
                            "sku", item.getSku(),
                            "reservedQuantity", part.getQuantityRequired().toString()
                    )
            );

            results.add(mapToJobPartDto(savedPart, job.getJobNumber()));
        }

        return results;
    }

    @Override
    @Transactional
    public List<JobPartStatusDto> releasePartsForJob(Long jobId, User caller) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        List<JobPart> reservedParts = jobPartRepository.findByJobIdAndStatus(jobId, PartReservationStatus.RESERVED);
        List<JobPartStatusDto> results = new ArrayList<>();

        for (JobPart part : reservedParts) {
            InventoryItem item = inventoryRepository.findByIdWithPessimisticLock(part.getInventoryItem().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("InventoryItem", "id", part.getInventoryItem().getId()));

            int oldAvailable = item.getQuantityAvailable();
            int oldReserved = item.getQuantityReserved();
            int qtyToRelease = Math.min(part.getQuantityRequired(), oldReserved);

            item.setQuantityReserved(oldReserved - qtyToRelease);
            item.setQuantityAvailable(oldAvailable + qtyToRelease);
            inventoryRepository.save(item);

            part.setStatus(PartReservationStatus.RELEASED);
            JobPart savedPart = jobPartRepository.save(part);

            auditService.logEvent(
                    "InventoryItem",
                    item.getId(),
                    AuditAction.INVENTORY_RELEASED,
                    caller,
                    String.format("Available: %d, Reserved: %d", oldAvailable, oldReserved),
                    String.format("Available: %d, Reserved: %d", item.getQuantityAvailable(), item.getQuantityReserved()),
                    Map.of(
                            "jobId", jobId.toString(),
                            "jobNumber", job.getJobNumber(),
                            "sku", item.getSku(),
                            "releasedQuantity", String.valueOf(qtyToRelease)
                    )
            );

            results.add(mapToJobPartDto(savedPart, job.getJobNumber()));
        }

        return results;
    }

    @Override
    @Transactional
    public List<JobPartStatusDto> consumePartsForJob(Long jobId, User caller) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        List<JobPart> reservedParts = jobPartRepository.findByJobIdAndStatus(jobId, PartReservationStatus.RESERVED);
        List<JobPartStatusDto> results = new ArrayList<>();
        Instant now = Instant.now();

        for (JobPart part : reservedParts) {
            InventoryItem item = inventoryRepository.findByIdWithPessimisticLock(part.getInventoryItem().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("InventoryItem", "id", part.getInventoryItem().getId()));

            int oldReserved = item.getQuantityReserved();
            int qtyToConsume = Math.min(part.getQuantityRequired(), oldReserved);

            item.setQuantityReserved(oldReserved - qtyToConsume);
            inventoryRepository.save(item);

            part.setStatus(PartReservationStatus.CONSUMED);
            part.setConsumedAt(now);
            JobPart savedPart = jobPartRepository.save(part);

            auditService.logEvent(
                    "InventoryItem",
                    item.getId(),
                    AuditAction.INVENTORY_CONSUMED,
                    caller,
                    String.format("Reserved: %d", oldReserved),
                    String.format("Reserved: %d, Consumed: %d", item.getQuantityReserved(), qtyToConsume),
                    Map.of(
                            "jobId", jobId.toString(),
                            "jobNumber", job.getJobNumber(),
                            "sku", item.getSku(),
                            "consumedQuantity", String.valueOf(qtyToConsume)
                    )
            );

            results.add(mapToJobPartDto(savedPart, job.getJobNumber()));
        }

        return results;
    }

    @Override
    @Transactional
    public InventoryItemDto adjustStock(InventoryAdjustmentDto dto, User caller) {
        InventoryItem item = inventoryRepository.findByIdWithPessimisticLock(dto.getItemId())
                .orElseThrow(() -> new ResourceNotFoundException("InventoryItem", "id", dto.getItemId()));

        int oldAvailable = item.getQuantityAvailable();
        int newAvailable = oldAvailable + dto.getQuantityChange();

        if (newAvailable < 0) {
            throw new BusinessValidationException(
                    String.format("Cannot adjust stock by %d for SKU '%s'. Resulting available stock would be negative (%d).",
                            dto.getQuantityChange(), item.getSku(), newAvailable)
            );
        }

        item.setQuantityAvailable(newAvailable);
        if (dto.getWarehouseLocation() != null && !dto.getWarehouseLocation().isBlank()) {
            item.setWarehouseLocation(dto.getWarehouseLocation());
        }

        InventoryItem saved = inventoryRepository.save(item);

        auditService.logEvent(
                "InventoryItem",
                item.getId(),
                AuditAction.INVENTORY_RESERVED, // using inventory audit category
                caller,
                String.format("Available: %d", oldAvailable),
                String.format("Available: %d", newAvailable),
                Map.of(
                        "sku", item.getSku(),
                        "adjustment", dto.getQuantityChange().toString(),
                        "reason", dto.getReason() != null ? dto.getReason() : "Manual stock adjustment"
                )
        );

        return mapToDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobPartStatusDto> getPartsForJob(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        return jobPartRepository.findByJobId(jobId)
                .stream()
                .map(part -> mapToJobPartDto(part, job.getJobNumber()))
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

    private LowStockAlertDto mapToAlertDto(InventoryItem item) {
        LowStockAlertDto dto = new LowStockAlertDto();
        dto.setItemId(item.getId());
        dto.setSku(item.getSku());
        dto.setName(item.getName());
        dto.setCategory(item.getCategory());
        dto.setQuantityAvailable(item.getQuantityAvailable());
        dto.setQuantityReserved(item.getQuantityReserved());
        dto.setMinimumThreshold(item.getMinimumThreshold());
        dto.setDeficit(Math.max(0, item.getMinimumThreshold() - item.getQuantityAvailable()));
        dto.setWarehouseLocation(item.getWarehouseLocation());
        dto.setUnitPrice(item.getUnitPrice());
        return dto;
    }

    private JobPartStatusDto mapToJobPartDto(JobPart part, String jobNumber) {
        JobPartStatusDto dto = new JobPartStatusDto();
        dto.setJobPartId(part.getId());
        if (part.getJob() != null) {
            dto.setJobId(part.getJob().getId());
        }
        dto.setJobNumber(jobNumber);

        if (part.getInventoryItem() != null) {
            dto.setInventoryItemId(part.getInventoryItem().getId());
            dto.setSku(part.getInventoryItem().getSku());
            dto.setPartName(part.getInventoryItem().getName());
            dto.setUnitPrice(part.getInventoryItem().getUnitPrice());
            if (part.getInventoryItem().getUnitPrice() != null && part.getQuantityRequired() != null) {
                dto.setTotalPrice(part.getInventoryItem().getUnitPrice().multiply(BigDecimal.valueOf(part.getQuantityRequired())));
            }
        }

        dto.setQuantityRequired(part.getQuantityRequired());
        dto.setStatus(part.getStatus());
        dto.setReservedAt(part.getReservedAt());
        dto.setConsumedAt(part.getConsumedAt());
        return dto;
    }
}
