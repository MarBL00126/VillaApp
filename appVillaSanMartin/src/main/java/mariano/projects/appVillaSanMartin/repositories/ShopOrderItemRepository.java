package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.ShopOrderItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface ShopOrderItemRepository extends JpaRepository<ShopOrderItemEntity, Integer> {
    List<ShopOrderItemEntity> findByOrderId(Integer orderId);
}
