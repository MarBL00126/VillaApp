package mariano.projects.appVillaSanMartin.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;


import mariano.projects.appVillaSanMartin.entities.StadiumServiceEntity;

public interface StadiumServiceRepository extends JpaRepository<StadiumServiceEntity, Integer>{
    List<StadiumServiceEntity> findByActiveTrue();

    List<StadiumServiceEntity> findByTypeAndActiveTrue(String type);

    List<StadiumServiceEntity> findBySector_IdAndActiveTrue(Integer sectorId);
}
