package mariano.projects.appVillaSanMartin.services;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import mariano.projects.appVillaSanMartin.entities.BoxScoreEntity;
import mariano.projects.appVillaSanMartin.entities.LiveMatchStateEntity;
import mariano.projects.appVillaSanMartin.entities.MatchEntity;
import mariano.projects.appVillaSanMartin.entities.PlayByPlayEntity;
import mariano.projects.appVillaSanMartin.entities.PlayerEntity;
import mariano.projects.appVillaSanMartin.models.requests.CreatePlayRequest;
import mariano.projects.appVillaSanMartin.models.requests.UpdateLiveMatchStateRequest;
import mariano.projects.appVillaSanMartin.models.responses.BoxScoreResponse;
import mariano.projects.appVillaSanMartin.models.responses.GameLeadersResponse;
import mariano.projects.appVillaSanMartin.models.responses.LiveMatchStateResponse;
import mariano.projects.appVillaSanMartin.models.responses.PlayByPlayResponse;
import mariano.projects.appVillaSanMartin.repositories.BoxScoreRepository;
import mariano.projects.appVillaSanMartin.repositories.LiveMatchStateRepository;
import mariano.projects.appVillaSanMartin.repositories.MatchRepository;
import mariano.projects.appVillaSanMartin.repositories.PlayByPlayRepository;
import mariano.projects.appVillaSanMartin.repositories.PlayerRepository;

@Service
public class GameCenterService {
    private final LiveMatchStateRepository liveMatchStateRepository;
    private final PlayByPlayRepository playByPlayRepository;
    private final BoxScoreRepository boxScoreRepository;
    private final MatchRepository matchRepository;
    private final PlayerRepository playerRepository;
    private final BoxScoreService boxScoreService;

    public GameCenterService(
            LiveMatchStateRepository liveMatchStateRepository,
            PlayByPlayRepository playByPlayRepository,
            BoxScoreRepository boxScoreRepository,
            MatchRepository matchRepository,
            PlayerRepository playerRepository,
            BoxScoreService boxScoreService) {
        this.liveMatchStateRepository = liveMatchStateRepository;
        this.playByPlayRepository = playByPlayRepository;
        this.boxScoreRepository = boxScoreRepository;
        this.matchRepository = matchRepository;
        this.playerRepository = playerRepository;
        this.boxScoreService = boxScoreService;
    }

    @Transactional
    public LiveMatchStateResponse getState(Integer matchId) {
        LiveMatchStateEntity entity = liveMatchStateRepository.findByMatch_Id(matchId)
                .orElseGet(() -> createInitialState(matchId));
        return toStateResponse(entity);
    }

    @Transactional
    public LiveMatchStateResponse updateState(Integer matchId, UpdateLiveMatchStateRequest request) {
        LiveMatchStateEntity entity = liveMatchStateRepository.findByMatch_Id(matchId)
                .orElseGet(() -> createInitialState(matchId));

        if (request.getStatus() != null) entity.setStatus(request.getStatus());
        if (request.getQuarter() != null) entity.setQuarter(request.getQuarter());
        if (request.getClock() != null) entity.setClock(request.getClock());
        if (request.getHomeScore() != null) entity.setHomeScore(request.getHomeScore());
        if (request.getAwayScore() != null) entity.setAwayScore(request.getAwayScore());

        return toStateResponse(liveMatchStateRepository.save(entity));
    }

    public List<PlayByPlayResponse> getPlays(Integer matchId, Integer quarter) {
        List<PlayByPlayEntity> plays = quarter == null
                ? playByPlayRepository.findByMatch_IdOrderByCreatedAtAsc(matchId)
                : playByPlayRepository.findByMatch_IdAndQuarterOrderByCreatedAtAsc(matchId, quarter);
        return plays.stream().map(this::toPlayResponse).collect(Collectors.toList());
    }

    public PlayByPlayResponse createPlay(Integer matchId, CreatePlayRequest request) {
        MatchEntity match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Match not found"));
        PlayerEntity player = null;
        if (request.getPlayerId() != null) {
            player = playerRepository.findById(request.getPlayerId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Player not found"));
        }

        PlayByPlayEntity entity = new PlayByPlayEntity();
        entity.setMatch(match);
        entity.setQuarter(request.getQuarter());
        entity.setClock(request.getClock());
        entity.setEventType(request.getEventType());
        entity.setPlayer(player);
        entity.setTeamIsLocal(request.getTeamIsLocal());
        entity.setHomeScore(request.getHomeScore() != null ? request.getHomeScore() : 0);
        entity.setAwayScore(request.getAwayScore() != null ? request.getAwayScore() : 0);
        entity.setDescription(request.getDescription());

        return toPlayResponse(playByPlayRepository.save(entity));
    }

    public GameLeadersResponse getLeaders(Integer matchId) {
        List<BoxScoreEntity> scores = boxScoreRepository.findByMatch_Id(matchId);
        return new GameLeadersResponse(
                findLeader(scores, Comparator.comparing(BoxScoreEntity::getPoints)),
                findLeader(scores, Comparator.comparing(BoxScoreEntity::getRebounds)),
                findLeader(scores, Comparator.comparing(BoxScoreEntity::getAssists)),
                findLeader(scores, Comparator.comparing(BoxScoreEntity::getSteals)),
                findLeader(scores, Comparator.comparing(BoxScoreEntity::getBlocks)));
    }

    private LiveMatchStateEntity createInitialState(Integer matchId) {
        MatchEntity match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Match not found"));
        LiveMatchStateEntity entity = new LiveMatchStateEntity();
        entity.setMatch(match);
        entity.setHomeScore(match.getTeamPoints());
        entity.setAwayScore(match.getOpponentPoints());
        return liveMatchStateRepository.save(entity);
    }

    private BoxScoreResponse findLeader(List<BoxScoreEntity> scores, Comparator<BoxScoreEntity> comparator) {
        Optional<BoxScoreEntity> leader = scores.stream().max(comparator);
        return leader.map(boxScoreService::toResponse).orElse(null);
    }

    private LiveMatchStateResponse toStateResponse(LiveMatchStateEntity entity) {
        return new LiveMatchStateResponse(
                entity.getId(),
                entity.getMatch().getId(),
                entity.getStatus(),
                entity.getQuarter(),
                entity.getClock(),
                entity.getHomeScore(),
                entity.getAwayScore(),
                entity.getLastUpdated());
    }

    private PlayByPlayResponse toPlayResponse(PlayByPlayEntity entity) {
        PlayerEntity player = entity.getPlayer();
        return new PlayByPlayResponse(
                entity.getId(),
                entity.getMatch().getId(),
                entity.getQuarter(),
                entity.getClock(),
                entity.getEventType(),
                player != null ? player.getId() : null,
                player != null ? player.getName() + " " + player.getSurname() : null,
                entity.getTeamIsLocal(),
                entity.getHomeScore(),
                entity.getAwayScore(),
                entity.getDescription(),
                entity.getCreatedAt());
    }
}
