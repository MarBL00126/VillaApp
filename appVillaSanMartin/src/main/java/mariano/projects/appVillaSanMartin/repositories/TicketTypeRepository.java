package mariano.projects.appVillaSanMartin.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;
import mariano.projects.appVillaSanMartin.entities.TicketTypeEntity;

@Repository
public interface TicketTypeRepository extends JpaRepository<TicketTypeEntity, Integer> {
    List<TicketTypeEntity> findByMatchId(int matchId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT t FROM TicketType t WHERE t.id = :id")
    Optional<TicketTypeEntity> findByIdWithLock(@Param("id") int id);
}
