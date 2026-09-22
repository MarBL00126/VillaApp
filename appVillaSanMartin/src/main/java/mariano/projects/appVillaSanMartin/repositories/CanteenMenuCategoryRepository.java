package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.CanteenMenuCategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface CanteenMenuCategoryRepository extends JpaRepository<CanteenMenuCategoryEntity, Integer> {
    List<CanteenMenuCategoryEntity> findAllByOrderBySortOrder();
}
