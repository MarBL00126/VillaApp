package mariano.projects.appVillaSanMartin.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import mariano.projects.appVillaSanMartin.entities.TeamEntity;

@Repository
public interface TeamRepository extends JpaRepository<TeamEntity, Integer> {
    List<TeamEntity> findByActive(boolean active);
}
