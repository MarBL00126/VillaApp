package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.FavoriteNewsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface FavoriteNewsRepository extends JpaRepository<FavoriteNewsEntity, Integer> {
    List<FavoriteNewsEntity> findByUserId(Integer userId);
    boolean existsByUserIdAndNewsId(Integer userId, Integer newsId);
}
