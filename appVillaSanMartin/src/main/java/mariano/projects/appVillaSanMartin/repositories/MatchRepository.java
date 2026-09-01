package mariano.projects.appVillaSanMartin.repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import mariano.projects.appVillaSanMartin.entities.MatchEntity;

@Repository
public interface MatchRepository extends JpaRepository<MatchEntity, Integer> {
    List<MatchEntity> findByMatchDateAfterOrderByMatchDateAsc(LocalDateTime date);

    List<MatchEntity> findByTeam_Id(int teamId);
}
