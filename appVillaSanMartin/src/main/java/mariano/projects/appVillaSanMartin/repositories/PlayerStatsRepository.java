package mariano.projects.appVillaSanMartin.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import mariano.projects.appVillaSanMartin.entities.PlayerStatsEntity;

@Repository
public interface PlayerStatsRepository extends JpaRepository<PlayerStatsEntity, Integer> {
    Optional<PlayerStatsEntity> findByPlayer_Id(int playerId);
}
