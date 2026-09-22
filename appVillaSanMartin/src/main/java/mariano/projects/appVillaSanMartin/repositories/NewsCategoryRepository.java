package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.NewsCategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface NewsCategoryRepository extends JpaRepository<NewsCategoryEntity, Integer> {
    Optional<NewsCategoryEntity> findBySlug(String slug);
}
