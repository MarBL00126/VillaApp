package mariano.projects.appVillaSanMartin.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import mariano.projects.appVillaSanMartin.entities.ReservationEntity;
import mariano.projects.appVillaSanMartin.entities.ReservationStatus;

@Repository
public interface ReservationRepository extends JpaRepository<ReservationEntity, Integer> {
    List<ReservationEntity> findByUserId(int userId);

    List<ReservationEntity> findByStatusAndExpiresAtBefore(
            ReservationStatus status,
            java.time.LocalDateTime dateTime);

}
