package mariano.projects.appVillaSanMartin.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import mariano.projects.appVillaSanMartin.entities.PressAccreditationEntity;

public interface PressAccreditationRepository extends JpaRepository<PressAccreditationEntity, Integer> {

    Optional<PressAccreditationEntity> findByQrCode(String qrCode);

    List<PressAccreditationEntity> findByStatus(String status);

    List<PressAccreditationEntity> findByMatchId(Integer matchId);

    List<PressAccreditationEntity> findByMatchIdAndStatus(
            Integer matchId,
            String status
    );

    List<PressAccreditationEntity> findByUserId(Integer userId);
    
}
