package mariano.projects.appVillaSanMartin.repositories;

import mariano.projects.appVillaSanMartin.entities.ReactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ReactionRepository extends JpaRepository<ReactionEntity, Integer> {
    Optional<ReactionEntity> findByUser_IdAndTargetTypeAndTargetIdAndType(int userId, String targetType, int targetId, String type);
    List<ReactionEntity> findByTargetTypeAndTargetId(String targetType, int targetId);
    long countByTargetTypeAndTargetIdAndType(String targetType, int targetId, String type);
}
