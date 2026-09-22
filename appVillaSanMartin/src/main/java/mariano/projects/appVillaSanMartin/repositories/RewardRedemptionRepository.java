package mariano.projects.appVillaSanMartin.repositories;

import mariano.projects.appVillaSanMartin.entities.RewardRedemptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RewardRedemptionRepository extends JpaRepository<RewardRedemptionEntity, Integer> {
    List<RewardRedemptionEntity> findByUser_IdOrderByRedeemedAtDesc(int userId);
}
