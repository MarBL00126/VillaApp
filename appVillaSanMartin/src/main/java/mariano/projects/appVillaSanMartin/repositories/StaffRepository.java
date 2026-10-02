package mariano.projects.appVillaSanMartin.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import mariano.projects.appVillaSanMartin.entities.StaffEntity;

@Repository
public interface StaffRepository extends JpaRepository<StaffEntity, Integer> {
    @EntityGraph(attributePaths = "team")
    List<StaffEntity> findByActiveTrue();

    @EntityGraph(attributePaths = "team")
    List<StaffEntity> findByTeam_IdAndActiveTrue(int teamId);
}
