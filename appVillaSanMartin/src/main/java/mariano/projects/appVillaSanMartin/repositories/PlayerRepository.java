package mariano.projects.appVillaSanMartin.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import mariano.projects.appVillaSanMartin.entities.PlayerEntity;

@Repository
public interface PlayerRepository extends JpaRepository<PlayerEntity, Integer> {
    List<PlayerEntity> findByTeam_Id(int teamId);
    List<PlayerEntity> findByActiveTrue();
    List<PlayerEntity> findByTeam_IdAndActiveTrue(int teamId);
}
