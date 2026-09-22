package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.CanteenMenuItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface CanteenMenuItemRepository extends JpaRepository<CanteenMenuItemEntity, Integer> {
    List<CanteenMenuItemEntity> findByCategoryIdAndAvailableTrue(Integer categoryId);
    List<CanteenMenuItemEntity> findByAvailableTrue();
}
