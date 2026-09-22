package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.ProductCategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategoryEntity, Integer> {
    Optional<ProductCategoryEntity> findBySlug(String slug);
    List<ProductCategoryEntity> findByActiveTrue();
}
