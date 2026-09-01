package mariano.projects.appVillaSanMartin.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import mariano.projects.appVillaSanMartin.entities.PurchaseOrderEntity;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrderEntity, Integer> {
    Optional<PurchaseOrderEntity> findByEntryCode(String entryCode);

    List<PurchaseOrderEntity> findByUserId(Long userId);

    Optional<PurchaseOrderEntity> findByIdAndUserId(int id, Long userId);
}
