package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.NotificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface NotificationRepository extends JpaRepository<NotificationEntity, Integer> {
    List<NotificationEntity> findByUser_IdOrderByCreatedAtDesc(int userId);
    List<NotificationEntity> findByUser_IdAndIsReadFalse(int userId);
    long countByUser_IdAndIsReadFalse(int userId);
}
