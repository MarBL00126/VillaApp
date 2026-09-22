package mariano.projects.appVillaSanMartin.repositories;

import mariano.projects.appVillaSanMartin.entities.MatchPredictionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface MatchPredictionRepository extends JpaRepository<MatchPredictionEntity, Integer> {
    Optional<MatchPredictionEntity> findByUser_IdAndMatch_Id(int userId, int matchId);
    List<MatchPredictionEntity> findByMatch_IdOrderByCreatedAtDesc(int matchId);
}
