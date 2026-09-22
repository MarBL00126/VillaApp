package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.ShopOrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface ShopOrderRepository extends JpaRepository<ShopOrderEntity, Integer> {
    List<ShopOrderEntity> findByUserIdOrderByCreatedAtDesc(Integer userId);
}
