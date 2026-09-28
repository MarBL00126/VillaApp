package mariano.projects.appVillaSanMartin.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import mariano.projects.appVillaSanMartin.entities.AppConfigEntity;

@Repository 
public interface AppConfigRepository  extends JpaRepository<AppConfigEntity, Integer> {
    Optional<AppConfigEntity> findByKey(String key);
    boolean existsByKey(String key);
    
}
