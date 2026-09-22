package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.ProductVariantEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariantEntity, Integer> {
    List<ProductVariantEntity> findByProductId(Integer productId);
}
