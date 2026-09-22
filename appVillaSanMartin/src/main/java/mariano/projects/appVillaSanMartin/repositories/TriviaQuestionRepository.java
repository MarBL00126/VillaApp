package mariano.projects.appVillaSanMartin.repositories;

import mariano.projects.appVillaSanMartin.entities.TriviaQuestionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TriviaQuestionRepository extends JpaRepository<TriviaQuestionEntity, Integer> {
    List<TriviaQuestionEntity> findByTriviaIdOrderBySortOrderAsc(int triviaId);
}
