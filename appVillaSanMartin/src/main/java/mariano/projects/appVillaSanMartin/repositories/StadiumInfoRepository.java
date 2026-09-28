package mariano.projects.appVillaSanMartin.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import mariano.projects.appVillaSanMartin.entities.StadiumInfoEntity;


public interface StadiumInfoRepository extends JpaRepository<StadiumInfoEntity, Integer>{
    
}
