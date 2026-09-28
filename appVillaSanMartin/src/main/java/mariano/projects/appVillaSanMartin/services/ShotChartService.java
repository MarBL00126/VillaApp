package mariano.projects.appVillaSanMartin.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import mariano.projects.appVillaSanMartin.entities.MatchEntity;
import mariano.projects.appVillaSanMartin.entities.PlayerEntity;
import mariano.projects.appVillaSanMartin.entities.ShotChartEntity;
import mariano.projects.appVillaSanMartin.models.requests.CreateShotRequest;
import mariano.projects.appVillaSanMartin.models.responses.ShotChartResponse;
import mariano.projects.appVillaSanMartin.repositories.MatchRepository;
import mariano.projects.appVillaSanMartin.repositories.PlayerRepository;
import mariano.projects.appVillaSanMartin.repositories.ShotChartRepository;

@Service
public class ShotChartService {
    private final ShotChartRepository shotChartRepository;
    private final MatchRepository matchRepository;
    private final PlayerRepository playerRepository;

    public ShotChartService(
            ShotChartRepository shotChartRepository,
            MatchRepository matchRepository,
            PlayerRepository playerRepository) {
        this.shotChartRepository = shotChartRepository;
        this.matchRepository = matchRepository;
        this.playerRepository = playerRepository;
    }

    public List<ShotChartResponse> getByMatch(Integer matchId) {
        return shotChartRepository.findByMatch_Id(matchId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ShotChartResponse> getByMatchAndPlayer(Integer matchId, Integer playerId) {
        return shotChartRepository.findByMatch_IdAndPlayer_IdOrderByCreatedAtAsc(matchId, playerId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ShotChartResponse create(Integer matchId, CreateShotRequest request) {
        MatchEntity match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Match not found"));
        PlayerEntity player = playerRepository.findById(request.getPlayerId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Player not found"));

        ShotChartEntity entity = new ShotChartEntity();
        entity.setMatch(match);
        entity.setPlayer(player);
        entity.setQuarter(request.getQuarter());
        entity.setClock(request.getClock());
        entity.setX(request.getX());
        entity.setY(request.getY());
        entity.setMade(request.getMade());
        entity.setShotType(request.getShotType());

        return toResponse(shotChartRepository.save(entity));
    }

    private ShotChartResponse toResponse(ShotChartEntity entity) {
        PlayerEntity player = entity.getPlayer();
        return new ShotChartResponse(
                entity.getId(),
                entity.getMatch().getId(),
                player.getId(),
                player.getName() + " " + player.getSurname(),
                entity.getQuarter(),
                entity.getClock(),
                entity.getX(),
                entity.getY(),
                entity.getMade(),
                entity.getShotType(),
                entity.getCreatedAt());
    }
}
