package mariano.projects.appVillaSanMartin.services;

import mariano.projects.appVillaSanMartin.entities.PollEntity;
import mariano.projects.appVillaSanMartin.entities.PollOptionEntity;
import mariano.projects.appVillaSanMartin.entities.PollVoteEntity;
import mariano.projects.appVillaSanMartin.models.dto.PollDetailDto;
import mariano.projects.appVillaSanMartin.models.dto.PollDto;
import mariano.projects.appVillaSanMartin.models.dto.PollOptionDto;
import mariano.projects.appVillaSanMartin.models.dto.PollVoteDto;
import mariano.projects.appVillaSanMartin.repositories.PollOptionRepository;
import mariano.projects.appVillaSanMartin.repositories.PollRepository;
import mariano.projects.appVillaSanMartin.repositories.PollVoteRepository;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PollService {
    private final PollRepository pollRepository;
    private final PollOptionRepository optionRepository;
    private final PollVoteRepository voteRepository;
    private final UserRepository userRepository;
    private final PointsService pointsService;

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "polls-active")
    public List<PollDto> getActive() {
        return pollRepository.findByActiveTrueOrderByCreatedAtDesc().stream().map(PollDto::from).toList();
    }

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "polls-mvp-by-match", key = "#matchId")
    public List<PollDto> getMvpByMatch(int matchId) {
        return pollRepository.findByTypeAndMatch_IdAndActiveTrueOrderByCreatedAtDesc("MVP_VOTE", matchId).stream()
            .map(PollDto::from)
            .toList();
    }

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "poll-detail", key = "#pollId")
    public PollDetailDto getDetail(int pollId) {
        PollEntity poll = pollRepository.findById(pollId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Encuesta no encontrada"));
        List<PollOptionEntity> options = optionRepository.findByPollIdOrderBySortOrderAsc(pollId);
        Map<Integer, Long> voteCounts = voteCountsByOptionId(options.stream().map(PollOptionEntity::getId).toList());
        List<PollOptionDto> optionDtos = options.stream()
            .map(option -> PollOptionDto.from(option, voteCounts.getOrDefault(option.getId(), 0L)))
            .toList();
        return PollDetailDto.from(poll, optionDtos);
    }

    @Transactional
    @Caching(evict = {
        @CacheEvict(cacheNames = "polls-active", allEntries = true),
        @CacheEvict(cacheNames = "polls-mvp-by-match", allEntries = true),
        @CacheEvict(cacheNames = "poll-detail", key = "#pollId")
    })
    public PollVoteDto vote(int userId, int pollId, int optionId) {
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
        return PollVoteDto.from(saved);
    }

    private Map<Integer, Long> voteCountsByOptionId(Collection<Integer> optionIds) {
        if (optionIds == null || optionIds.isEmpty()) {
            return Map.of();
        }
        return voteRepository.countByOptionIds(optionIds).stream()
            .collect(Collectors.toMap(
                row -> ((Number) row[0]).intValue(),
                row -> ((Number) row[1]).longValue(),
                (left, right) -> right));
    }
}
