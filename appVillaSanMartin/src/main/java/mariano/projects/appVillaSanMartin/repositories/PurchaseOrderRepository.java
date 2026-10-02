package mariano.projects.appVillaSanMartin.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;
import mariano.projects.appVillaSanMartin.entities.PurchaseOrderEntity;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrderEntity, Integer> {
    Optional<PurchaseOrderEntity> findByEntryCode(String entryCode);

    List<PurchaseOrderEntity> findByUserId(Long userId);

    Optional<PurchaseOrderEntity> findByIdAndUserId(int id, Long userId);
    @Lock(LockModeType.PESSIMISTIC_WRITE) 
    @Query("SELECT o FROM PurchaseOrderEntity o WHERE o.id = :id") 
    Optional<PurchaseOrderEntity> findByIdForUpdate(@Param("id") int id); 
}
