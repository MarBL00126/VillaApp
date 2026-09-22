package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.CanteenOrderItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface CanteenOrderItemRepository extends JpaRepository<CanteenOrderItemEntity, Integer> {
    List<CanteenOrderItemEntity> findByOrderId(Integer orderId);
}
