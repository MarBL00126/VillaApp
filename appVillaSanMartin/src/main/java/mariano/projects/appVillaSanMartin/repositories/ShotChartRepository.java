package mariano.projects.appVillaSanMartin.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import mariano.projects.appVillaSanMartin.entities.ShotChartEntity;

@Repository
public interface ShotChartRepository extends JpaRepository<ShotChartEntity, Integer> {
    List<ShotChartEntity> findByMatch_Id(Integer matchId);

    List<ShotChartEntity> findByMatch_IdAndPlayer_IdOrderByCreatedAtAsc(Integer matchId, Integer playerId);

    List<ShotChartEntity> findByPlayer_Id(Integer playerId);
}
