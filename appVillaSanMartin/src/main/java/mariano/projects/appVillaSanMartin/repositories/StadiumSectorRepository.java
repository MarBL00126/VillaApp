package mariano.projects.appVillaSanMartin.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import mariano.projects.appVillaSanMartin.entities.StadiumSectorEntity;

public interface StadiumSectorRepository extends JpaRepository<StadiumSectorEntity, Integer>{
    List<StadiumSectorEntity> findByActiveTrue();
}
