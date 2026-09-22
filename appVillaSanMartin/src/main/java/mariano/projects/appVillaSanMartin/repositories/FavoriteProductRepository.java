package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.FavoriteProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
@Repository
public interface FavoriteProductRepository extends JpaRepository<FavoriteProductEntity, Integer> {
    List<FavoriteProductEntity> findByUserId(Integer userId);
    Optional<FavoriteProductEntity> findByUserIdAndProductId(Integer userId, Integer productId);
    boolean existsByUserIdAndProductId(Integer userId, Integer productId);
}
