package mariano.projects.appVillaSanMartin.repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import mariano.projects.appVillaSanMartin.entities.AuditLogEntity;

@Repository 
public interface AuditLogRepository extends JpaRepository<AuditLogEntity, Integer>{
    List<AuditLogEntity> findByUser_IdOrderByCreatedAtDesc(Integer userId);
    List<AuditLogEntity> findByActionOrderByCreatedAtDesc(String action);
    List<AuditLogEntity> findByEntityTypeAndEntityIdOrderByCreatedAtDesc(String entityType, Integer
        entityId);
    List<AuditLogEntity> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime from,
        LocalDateTime to);

    
}
