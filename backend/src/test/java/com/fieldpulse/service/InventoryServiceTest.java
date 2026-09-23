package com.fieldpulse.service;

import com.fieldpulse.domain.entity.InventoryItem;
import com.fieldpulse.domain.entity.Job;
import com.fieldpulse.domain.entity.JobPart;
import com.fieldpulse.domain.entity.User;
import com.fieldpulse.domain.enums.AuditAction;
import com.fieldpulse.domain.enums.PartReservationStatus;
import com.fieldpulse.dto.InventoryItemDto;
import com.fieldpulse.dto.inventory.InventoryAdjustmentDto;
import com.fieldpulse.dto.inventory.JobPartStatusDto;
import com.fieldpulse.exception.BusinessValidationException;
import com.fieldpulse.exception.InsufficientInventoryException;
import com.fieldpulse.repository.InventoryItemRepository;
import com.fieldpulse.repository.JobPartRepository;
import com.fieldpulse.repository.JobRepository;
import com.fieldpulse.service.impl.InventoryServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InventoryServiceTest {

    @Mock
    private InventoryItemRepository inventoryRepository;

    @Mock
    private JobPartRepository jobPartRepository;

    @Mock
    private JobRepository jobRepository;

    @Mock
    private AuditService auditService;

    private InventoryService inventoryService;

    @BeforeEach
    void setUp() {
        inventoryService = new InventoryServiceImpl(
                inventoryRepository,
                jobPartRepository,
                jobRepository,
                auditService
        );
    }

    private InventoryItem createTestItem(Long id, String sku, int available, int reserved) {
        InventoryItem item = new InventoryItem();
        item.setId(id);
        item.setSku(sku);
        item.setName("Test Part - " + sku);
        item.setCategory("HVAC");
        item.setUnitPrice(new BigDecimal("75.00"));
        item.setQuantityAvailable(available);
        item.setQuantityReserved(reserved);
        item.setMinimumThreshold(5);
        item.setWarehouseLocation("Aisle 4, Bay 12");
        return item;
    }

    private Job createTestJob(Long id) {
        Job job = new Job();
        job.setId(id);
        job.setJobNumber("JOB-2026-0100");
        return job;
    }

    private JobPart createTestJobPart(Long id, Job job, InventoryItem item, int qty, PartReservationStatus status) {
        JobPart part = new JobPart();
        part.setId(id);
        part.setJob(job);
        part.setInventoryItem(item);
        part.setQuantityRequired(qty);
        part.setStatus(status);
        return part;
    }

    @Test
    @DisplayName("Should successfully reserve parts with pessimistic lock and decrement available stock")
    void testReservePartsSuccess() {
        Job job = createTestJob(100L);
        InventoryItem item = createTestItem(1L, "SKU-HVAC-01", 10, 0);
        JobPart part = createTestJobPart(10L, job, item, 3, PartReservationStatus.REQUESTED);
        User caller = new User();
        caller.setEmail("dispatcher.sarah@fieldpulse.io");

        when(jobRepository.findById(100L)).thenReturn(Optional.of(job));
        when(jobPartRepository.findByJobId(100L)).thenReturn(List.of(part));
        when(inventoryRepository.findByIdWithPessimisticLock(1L)).thenReturn(Optional.of(item));
        when(jobPartRepository.save(any(JobPart.class))).thenAnswer(inv -> inv.getArgument(0));

        List<JobPartStatusDto> results = inventoryService.reservePartsForJob(100L, caller);

        assertEquals(1, results.size());
        assertEquals(PartReservationStatus.RESERVED, results.get(0).getStatus());
        assertEquals(7, item.getQuantityAvailable());
        assertEquals(3, item.getQuantityReserved());

        verify(inventoryRepository, times(1)).save(item);
        verify(jobPartRepository, times(1)).save(part);
        verify(auditService, times(1)).logEvent(
                eq("InventoryItem"),
                eq(1L),
                eq(AuditAction.INVENTORY_RESERVED),
                eq(caller),
                any(),
                any(),
                any()
        );
    }

    @Test
    @DisplayName("Should abort reservation and throw InsufficientInventoryException when requested > available")
    void testReservePartsInsufficientStockThrowsException() {
        Job job = createTestJob(100L);
        InventoryItem item = createTestItem(1L, "SKU-HVAC-01", 2, 0);
        JobPart part = createTestJobPart(10L, job, item, 5, PartReservationStatus.REQUESTED);

        when(jobRepository.findById(100L)).thenReturn(Optional.of(job));
        when(jobPartRepository.findByJobId(100L)).thenReturn(List.of(part));
        when(inventoryRepository.findByIdWithPessimisticLock(1L)).thenReturn(Optional.of(item));

        InsufficientInventoryException ex = assertThrows(
                InsufficientInventoryException.class,
                () -> inventoryService.reservePartsForJob(100L, null)
        );

        assertTrue(ex.getMessage().contains("Insufficient inventory"));
        assertEquals(2, item.getQuantityAvailable()); // unchanged
        assertEquals(0, item.getQuantityReserved());   // unchanged
        verify(inventoryRepository, never()).save(any());
        verify(jobPartRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should release reserved parts on cancellation and restore available stock")
    void testReleasePartsForJob() {
        Job job = createTestJob(100L);
        InventoryItem item = createTestItem(1L, "SKU-HVAC-01", 7, 3);
        JobPart part = createTestJobPart(10L, job, item, 3, PartReservationStatus.RESERVED);

        when(jobRepository.findById(100L)).thenReturn(Optional.of(job));
        when(jobPartRepository.findByJobIdAndStatus(100L, PartReservationStatus.RESERVED)).thenReturn(List.of(part));
        when(inventoryRepository.findByIdWithPessimisticLock(1L)).thenReturn(Optional.of(item));
        when(jobPartRepository.save(any(JobPart.class))).thenAnswer(inv -> inv.getArgument(0));

        List<JobPartStatusDto> results = inventoryService.releasePartsForJob(100L, null);

        assertEquals(1, results.size());
        assertEquals(PartReservationStatus.RELEASED, results.get(0).getStatus());
        assertEquals(10, item.getQuantityAvailable()); // restored
        assertEquals(0, item.getQuantityReserved());

        verify(inventoryRepository, times(1)).save(item);
        verify(auditService, times(1)).logEvent(
                eq("InventoryItem"),
                eq(1L),
                eq(AuditAction.INVENTORY_RELEASED),
                any(),
                any(),
                any(),
                any()
        );
    }

    @Test
    @DisplayName("Should permanently consume reserved parts upon job completion")
    void testConsumePartsForJob() {
        Job job = createTestJob(100L);
        InventoryItem item = createTestItem(1L, "SKU-HVAC-01", 7, 3);
        JobPart part = createTestJobPart(10L, job, item, 3, PartReservationStatus.RESERVED);

        when(jobRepository.findById(100L)).thenReturn(Optional.of(job));
        when(jobPartRepository.findByJobIdAndStatus(100L, PartReservationStatus.RESERVED)).thenReturn(List.of(part));
        when(inventoryRepository.findByIdWithPessimisticLock(1L)).thenReturn(Optional.of(item));
        when(jobPartRepository.save(any(JobPart.class))).thenAnswer(inv -> inv.getArgument(0));

        List<JobPartStatusDto> results = inventoryService.consumePartsForJob(100L, null);

        assertEquals(1, results.size());
        assertEquals(PartReservationStatus.CONSUMED, results.get(0).getStatus());
        assertEquals(7, item.getQuantityAvailable()); // stays 7, not restored
        assertEquals(0, item.getQuantityReserved());  // consumed

        verify(inventoryRepository, times(1)).save(item);
        verify(auditService, times(1)).logEvent(
                eq("InventoryItem"),
                eq(1L),
                eq(AuditAction.INVENTORY_CONSUMED),
                any(),
                any(),
                any(),
                any()
        );
    }

    @Test
    @DisplayName("Should adjust stock correctly on manual restock")
    void testAdjustStockSuccess() {
        InventoryItem item = createTestItem(1L, "SKU-HVAC-01", 5, 0);
        InventoryAdjustmentDto dto = new InventoryAdjustmentDto(1L, 15, "Supplier shipment received", "Warehouse B, Section 3");

        when(inventoryRepository.findByIdWithPessimisticLock(1L)).thenReturn(Optional.of(item));
        when(inventoryRepository.save(any(InventoryItem.class))).thenAnswer(inv -> inv.getArgument(0));

        InventoryItemDto result = inventoryService.adjustStock(dto, null);

        assertNotNull(result);
        assertEquals(20, result.getQuantityAvailable());
        assertEquals("Warehouse B, Section 3", result.getWarehouseLocation());
        assertFalse(result.isLowStock());
    }

    @Test
    @DisplayName("Should reject stock adjustment if resulting available stock would be negative")
    void testAdjustStockNegativeFails() {
        InventoryItem item = createTestItem(1L, "SKU-HVAC-01", 3, 0);
        InventoryAdjustmentDto dto = new InventoryAdjustmentDto(1L, -10, "Damaged stock deduction", null);

        when(inventoryRepository.findByIdWithPessimisticLock(1L)).thenReturn(Optional.of(item));

        BusinessValidationException ex = assertThrows(
                BusinessValidationException.class,
                () -> inventoryService.adjustStock(dto, null)
        );

        assertTrue(ex.getMessage().contains("negative"));
        verify(inventoryRepository, never()).save(any());
    }
}
