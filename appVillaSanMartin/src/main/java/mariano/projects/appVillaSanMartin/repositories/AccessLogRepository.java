package mariano.projects.appVillaSanMartin.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import mariano.projects.appVillaSanMartin.entities.AccessLogEntity;

public interface AccessLogRepository extends JpaRepository<AccessLogEntity, Integer> {

    List<AccessLogEntity> findByMatchIdOrderByScannedAtDesc(Integer matchId);

    List<AccessLogEntity> findByTicketId(Integer ticketId);

    boolean existsByTicketIdAndStatus(Integer ticketId, String status);
    
}
