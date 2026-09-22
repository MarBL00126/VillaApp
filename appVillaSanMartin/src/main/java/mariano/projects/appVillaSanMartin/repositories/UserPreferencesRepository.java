package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.UserPreferencesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface UserPreferencesRepository extends JpaRepository<UserPreferencesEntity, Integer> {
    Optional<UserPreferencesEntity> findByUser_Id(int userId);
    long countByFavoritePlayer_Id(int playerId);
}
