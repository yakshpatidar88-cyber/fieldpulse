package com.fieldpulse.repository;

import com.fieldpulse.domain.entity.InventoryItem;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {
    Optional<InventoryItem> findBySku(String sku);
    List<InventoryItem> findByCategory(String category);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT i FROM InventoryItem i WHERE i.id = :id")
    Optional<InventoryItem> findByIdWithPessimisticLock(@Param("id") Long id);

    @Query("SELECT i FROM InventoryItem i WHERE i.quantityAvailable <= i.minimumThreshold")
    List<InventoryItem> findLowStockItems();
}
