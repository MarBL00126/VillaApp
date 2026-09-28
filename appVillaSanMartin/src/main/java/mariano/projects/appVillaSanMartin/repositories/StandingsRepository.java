package mariano.projects.appVillaSanMartin.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import mariano.projects.appVillaSanMartin.entities.StandingsEntity;

@Repository
public interface StandingsRepository extends JpaRepository<StandingsEntity, Integer> {
    List<StandingsEntity> findBySeason(Integer season);

    List<StandingsEntity> findBySeasonOrderByPositionAsc(Integer season);

    List<StandingsEntity> findBySeasonAndZoneOrderByPositionAsc(Integer season, String zone);

    Optional<StandingsEntity> findByTeamNameAndSeason(String teamName, Integer season);
}
