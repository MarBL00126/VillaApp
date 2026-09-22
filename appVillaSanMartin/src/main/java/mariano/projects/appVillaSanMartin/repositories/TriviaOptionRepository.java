package mariano.projects.appVillaSanMartin.repositories;

import mariano.projects.appVillaSanMartin.entities.TriviaOptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Collection;
import java.util.List;

public interface TriviaOptionRepository extends JpaRepository<TriviaOptionEntity, Integer> {
    List<TriviaOptionEntity> findByQuestionIdOrderByIdAsc(int questionId);
    List<TriviaOptionEntity> findByQuestionIdIn(Collection<Integer> questionIds);
}
