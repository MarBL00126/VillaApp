package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.CanteenOrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
@Repository
public interface CanteenOrderRepository extends JpaRepository<CanteenOrderEntity, Integer> {
    Optional<CanteenOrderEntity> findByOrderNumber(String orderNumber);
    List<CanteenOrderEntity> findByUserIdOrderByCreatedAtDesc(Integer userId);
    List<CanteenOrderEntity> findByStatus(String status);
}
