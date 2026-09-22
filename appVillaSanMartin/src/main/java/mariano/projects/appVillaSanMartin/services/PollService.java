package mariano.projects.appVillaSanMartin.services;

import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PollService {
    private final PollRepository pollRepository;
    private final PollOptionRepository optionRepository;
    private final PollVoteRepository voteRepository;
    private final UserRepository userRepository;
    private final PointsService pointsService;

    public List<PollEntity> getActive() {
        return pollRepository.findByActiveTrueOrderByCreatedAtDesc();
    }

    public List<PollEntity> getMvpByMatch(int matchId) {
        return pollRepository.findByTypeAndMatch_IdAndActiveTrueOrderByCreatedAtDesc("MVP_VOTE", matchId);
    }

    public Map<String, Object> getDetail(int pollId) {
        PollEntity poll = pollRepository.findById(pollId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Encuesta no encontrada"));
        List<Map<String, Object>> options = optionRepository.findByPollIdOrderBySortOrderAsc(pollId).stream()
            .map(option -> Map.of(
                "id", option.getId(),
                "text", option.getText(),
                "player", option.getPlayer(),
                "votes", voteRepository.countByOption_Id(option.getId())
            ))
            .toList();
        return Map.of("poll", poll, "options", options);
    }

    @Transactional
    public PollVoteEntity vote(int userId, int pollId, int optionId) {
        PollEntity poll = pollRepository.findById(pollId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Encuesta no encontrada"));
        PollOptionEntity option = optionRepository.findById(optionId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Opcion no encontrada"));
        if (!option.getPollId().equals(pollId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La opcion no pertenece a la encuesta");
        }

        PollVoteEntity vote = voteRepository.findByUser_IdAndPoll_Id(userId, pollId).orElseGet(PollVoteEntity::new);
        boolean isNew = vote.getId() == null;
        vote.setUser(userRepository.findById(userId).orElseThrow());
        vote.setPoll(poll);
        vote.setOption(option);
        if (vote.getCreatedAt() == null) vote.setCreatedAt(LocalDateTime.now());
        PollVoteEntity saved = voteRepository.save(vote);
        if (isNew) pointsService.award(userId, 5, "MVP_VOTE".equals(poll.getType()) ? "MVP_VOTE" : "POLL", saved.getId());
        return saved;
    }
}
