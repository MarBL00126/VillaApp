package mariano.projects.appVillaSanMartin.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import mariano.projects.appVillaSanMartin.entities.PressAccessLogEntity;

public interface PressAccessLogRepository  extends JpaRepository<PressAccessLogEntity, Integer> {

    List<PressAccessLogEntity> findByAccreditationIdOrderByScannedAtDesc(
            Integer accreditationId
    );
    
}
