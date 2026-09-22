package mariano.projects.appVillaSanMartin.repositories;

import mariano.projects.appVillaSanMartin.entities.PointsTransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PointsTransactionRepository extends JpaRepository<PointsTransactionEntity, Integer> {
    List<PointsTransactionEntity> findByAccount_User_IdOrderByCreatedAtDesc(int userId);
}
