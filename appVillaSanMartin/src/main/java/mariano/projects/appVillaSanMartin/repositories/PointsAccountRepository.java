package mariano.projects.appVillaSanMartin.repositories;

import mariano.projects.appVillaSanMartin.entities.PointsAccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PointsAccountRepository extends JpaRepository<PointsAccountEntity, Integer> {
    Optional<PointsAccountEntity> findByUser_Id(int userId);
    List<PointsAccountEntity> findTop10ByOrderByTotalPointsDesc();
}
