package mariano.projects.appVillaSanMartin.repositories;

import mariano.projects.appVillaSanMartin.entities.PollEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PollRepository extends JpaRepository<PollEntity, Integer> {
    List<PollEntity> findByActiveTrueOrderByCreatedAtDesc();
    List<PollEntity> findByTypeAndActiveTrueOrderByCreatedAtDesc(String type);
    List<PollEntity> findByTypeAndMatch_IdAndActiveTrueOrderByCreatedAtDesc(String type, int matchId);
}
