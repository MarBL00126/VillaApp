package mariano.projects.appVillaSanMartin.repositories;

import mariano.projects.appVillaSanMartin.entities.BadgeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BadgeRepository extends JpaRepository<BadgeEntity, Integer> {
    List<BadgeEntity> findByActiveTrueOrderByRequiredPointsAsc();
}
