package mariano.projects.appVillaSanMartin.repositories;

import mariano.projects.appVillaSanMartin.entities.PollVoteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PollVoteRepository extends JpaRepository<PollVoteEntity, Integer> {
    Optional<PollVoteEntity> findByUser_IdAndPoll_Id(int userId, int pollId);
    List<PollVoteEntity> findByPoll_Id(int pollId);
    long countByOption_Id(int optionId);
}
