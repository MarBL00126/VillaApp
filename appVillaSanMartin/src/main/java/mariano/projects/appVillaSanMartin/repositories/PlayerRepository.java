package mariano.projects.appVillaSanMartin.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import mariano.projects.appVillaSanMartin.entities.PlayerEntity;

@Repository
public interface PlayerRepository extends JpaRepository<PlayerEntity, Integer> {
    List<PlayerEntity> findByTeam_Id(int teamId);

    @EntityGraph(attributePaths = "team")
    Page<PlayerEntity> findByActiveTrue(Pageable pageable);

    @EntityGraph(attributePaths = "team")
    List<PlayerEntity> findByActiveTrue();

    @EntityGraph(attributePaths = "team")
    Page<PlayerEntity> findByTeam_IdAndActiveTrue(int teamId, Pageable pageable);

    @EntityGraph(attributePaths = "team")
    List<PlayerEntity> findByTeam_IdAndActiveTrue(int teamId);

    @EntityGraph(attributePaths = "team")
    Optional<PlayerEntity> findByIdAndActiveTrue(int id);
}
