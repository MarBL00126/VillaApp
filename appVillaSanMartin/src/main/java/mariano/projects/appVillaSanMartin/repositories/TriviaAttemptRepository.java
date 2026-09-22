package mariano.projects.appVillaSanMartin.repositories;

import mariano.projects.appVillaSanMartin.entities.TriviaAttemptEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TriviaAttemptRepository extends JpaRepository<TriviaAttemptEntity, Integer> {
    Optional<TriviaAttemptEntity> findByUser_IdAndTrivia_Id(int userId, int triviaId);
}
