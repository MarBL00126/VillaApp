package mariano.projects.appVillaSanMartin.repositories;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import mariano.projects.appVillaSanMartin.entities.BoxScoreEntity;

@Repository
public interface BoxScoreRepository extends JpaRepository<BoxScoreEntity, Integer> {
    List<BoxScoreEntity> findByMatch_Id(Integer matchId);

    Optional<BoxScoreEntity> findByMatch_IdAndPlayer_Id(Integer matchId, Integer playerId);

    List<BoxScoreEntity> findByPlayer_Id(Integer playerId);

    List<BoxScoreEntity> findByPlayer_IdAndMatch_MatchDateBetween(
            Integer playerId,
            LocalDateTime from,
            LocalDateTime to);

    List<BoxScoreEntity> findByMatch_MatchDateBetween(LocalDateTime from, LocalDateTime to);
}
