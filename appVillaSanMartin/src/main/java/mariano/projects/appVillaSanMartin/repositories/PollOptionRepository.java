package mariano.projects.appVillaSanMartin.repositories;

import mariano.projects.appVillaSanMartin.entities.PollOptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PollOptionRepository extends JpaRepository<PollOptionEntity, Integer> {
    List<PollOptionEntity> findByPollIdOrderBySortOrderAsc(int pollId);
}
