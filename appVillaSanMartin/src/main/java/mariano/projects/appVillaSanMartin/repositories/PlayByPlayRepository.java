package mariano.projects.appVillaSanMartin.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import mariano.projects.appVillaSanMartin.entities.PlayByPlayEntity;

@Repository
public interface PlayByPlayRepository extends JpaRepository<PlayByPlayEntity, Integer> {
    List<PlayByPlayEntity> findByMatch_Id(Integer matchId);

    List<PlayByPlayEntity> findByMatch_IdOrderByCreatedAtAsc(Integer matchId);

    List<PlayByPlayEntity> findByMatch_IdAndQuarterOrderByCreatedAtAsc(Integer matchId, Integer quarter);
}
