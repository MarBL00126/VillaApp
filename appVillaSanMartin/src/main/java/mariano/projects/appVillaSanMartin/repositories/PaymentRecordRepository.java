package mariano.projects.appVillaSanMartin.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import mariano.projects.appVillaSanMartin.entities.PaymentRecordEntity;

@Repository
public interface PaymentRecordRepository extends JpaRepository<PaymentRecordEntity, Integer> {
    Optional<PaymentRecordEntity> findByPurchaseOrderId(Long orderId);

    Optional<PaymentRecordEntity> findByMpPaymentId(Long mpPaymentId);
}
