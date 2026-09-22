package mariano.projects.appVillaSanMartin.repositories;

import mariano.projects.appVillaSanMartin.entities.UserBadgeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserBadgeRepository extends JpaRepository<UserBadgeEntity, Integer> {
    List<UserBadgeEntity> findByUser_IdOrderByEarnedAtDesc(int userId);
    boolean existsByUser_IdAndBadge_Id(int userId, int badgeId);
}
