package mariano.projects.appVillaSanMartin.repositories;

import mariano.projects.appVillaSanMartin.entities.TriviaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TriviaRepository extends JpaRepository<TriviaEntity, Integer> {
    List<TriviaEntity> findByActiveTrueOrderByCreatedAtDesc();
}
