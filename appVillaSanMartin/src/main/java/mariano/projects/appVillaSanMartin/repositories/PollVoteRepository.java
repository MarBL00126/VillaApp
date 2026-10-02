package mariano.projects.appVillaSanMartin.repositories;

import mariano.projects.appVillaSanMartin.entities.PollVoteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface PollVoteRepository extends JpaRepository<PollVoteEntity, Integer> {
    Optional<PollVoteEntity> findByUser_IdAndPoll_Id(int userId, int pollId);
    List<PollVoteEntity> findByPoll_Id(int pollId);
    long countByOption_Id(int optionId);
    @Query("select v.option.id, count(v) from PollVoteEntity v where v.option.id in :optionIds group by v.option.id")
    List<Object[]> countByOptionIds(@Param("optionIds") Collection<Integer> optionIds);
}
