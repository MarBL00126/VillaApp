package mariano.projects.appVillaSanMartin.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import mariano.projects.appVillaSanMartin.entities.LiveMatchStateEntity;

@Repository
public interface LiveMatchStateRepository extends JpaRepository<LiveMatchStateEntity, Integer> {
    Optional<LiveMatchStateEntity> findByMatch_Id(Integer matchId);
}
