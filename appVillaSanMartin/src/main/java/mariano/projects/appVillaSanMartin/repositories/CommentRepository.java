package mariano.projects.appVillaSanMartin.repositories;

import mariano.projects.appVillaSanMartin.entities.CommentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<CommentEntity, Integer> {
    List<CommentEntity> findByTargetTypeAndTargetIdOrderByCreatedAtAsc(String targetType, int targetId);
    List<CommentEntity> findTop50ByOrderByCreatedAtDesc();
}
