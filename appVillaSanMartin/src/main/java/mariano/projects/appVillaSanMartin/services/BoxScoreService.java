package mariano.projects.appVillaSanMartin.services;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import mariano.projects.appVillaSanMartin.entities.BoxScoreEntity;
import mariano.projects.appVillaSanMartin.entities.MatchEntity;
import mariano.projects.appVillaSanMartin.entities.PlayerEntity;
import mariano.projects.appVillaSanMartin.models.requests.UpdateBoxScoreRequest;
import mariano.projects.appVillaSanMartin.models.responses.BoxScoreResponse;
import mariano.projects.appVillaSanMartin.repositories.BoxScoreRepository;
import mariano.projects.appVillaSanMartin.repositories.MatchRepository;
import mariano.projects.appVillaSanMartin.repositories.PlayerRepository;

@Service
public class BoxScoreService {
    private final BoxScoreRepository boxScoreRepository;
    private final MatchRepository matchRepository;
    private final PlayerRepository playerRepository;

    public BoxScoreService(
            BoxScoreRepository boxScoreRepository,
            MatchRepository matchRepository,
            PlayerRepository playerRepository) {
        this.boxScoreRepository = boxScoreRepository;
        this.matchRepository = matchRepository;
        this.playerRepository = playerRepository;
    }

    public List<BoxScoreResponse> getByMatch(Integer matchId) {
        return boxScoreRepository.findByMatch_Id(matchId).stream()
                .sorted(Comparator.comparing((BoxScoreEntity item) -> !Boolean.TRUE.equals(item.getTeamIsLocal()))
                        .thenComparing(item -> item.getPlayer().getSurname())
                        .thenComparing(item -> item.getPlayer().getName()))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public BoxScoreResponse getByMatchAndPlayer(Integer matchId, Integer playerId) {
        return toResponse(findByMatchAndPlayer(matchId, playerId));
    }

    public BoxScoreEntity findByMatchAndPlayer(Integer matchId, Integer playerId) {
        return boxScoreRepository.findByMatch_IdAndPlayer_Id(matchId, playerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Box score not found"));
    }

    public BoxScoreResponse upsert(Integer matchId, Integer playerId, UpdateBoxScoreRequest request) {
        MatchEntity match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Match not found"));
        PlayerEntity player = playerRepository.findById(playerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Player not found"));

        BoxScoreEntity entity = boxScoreRepository.findByMatch_IdAndPlayer_Id(matchId, playerId)
                .orElseGet(() -> {
                    BoxScoreEntity created = new BoxScoreEntity();
                    created.setMatch(match);
                    created.setPlayer(player);
                    created.setTeamIsLocal(Boolean.TRUE);
                    return created;
                });

        apply(entity, request);
        return toResponse(boxScoreRepository.save(entity));
    }

    public BoxScoreResponse toResponse(BoxScoreEntity entity) {
        PlayerEntity player = entity.getPlayer();
        return new BoxScoreResponse(
                entity.getId(),
                entity.getMatch().getId(),
                player.getId(),
                player.getName() + " " + player.getSurname(),
                entity.getTeamIsLocal(),
                entity.getMinutes(),
                entity.getFgMade(),
                entity.getFgAtt(),
                entity.getThreeMade(),
                entity.getThreeAtt(),
                entity.getFtMade(),
                entity.getFtAtt(),
                entity.getPoints(),
                entity.getRebounds(),
                entity.getOffRebounds(),
                entity.getDefRebounds(),
                entity.getAssists(),
                entity.getSteals(),
                entity.getBlocks(),
                entity.getTurnovers(),
                entity.getFouls(),
                entity.getPlusMinus());
    }

    private void apply(BoxScoreEntity entity, UpdateBoxScoreRequest request) {
        if (request.getTeamIsLocal() != null) entity.setTeamIsLocal(request.getTeamIsLocal());
        if (request.getMinutes() != null) entity.setMinutes(request.getMinutes());
        if (request.getFgMade() != null) entity.setFgMade(request.getFgMade());
        if (request.getFgAtt() != null) entity.setFgAtt(request.getFgAtt());
        if (request.getThreeMade() != null) entity.setThreeMade(request.getThreeMade());
        if (request.getThreeAtt() != null) entity.setThreeAtt(request.getThreeAtt());
        if (request.getFtMade() != null) entity.setFtMade(request.getFtMade());
        if (request.getFtAtt() != null) entity.setFtAtt(request.getFtAtt());
        if (request.getPoints() != null) entity.setPoints(request.getPoints());
        if (request.getRebounds() != null) entity.setRebounds(request.getRebounds());
        if (request.getOffRebounds() != null) entity.setOffRebounds(request.getOffRebounds());
        if (request.getDefRebounds() != null) entity.setDefRebounds(request.getDefRebounds());
        if (request.getAssists() != null) entity.setAssists(request.getAssists());
        if (request.getSteals() != null) entity.setSteals(request.getSteals());
        if (request.getBlocks() != null) entity.setBlocks(request.getBlocks());
        if (request.getTurnovers() != null) entity.setTurnovers(request.getTurnovers());
        if (request.getFouls() != null) entity.setFouls(request.getFouls());
        if (request.getPlusMinus() != null) entity.setPlusMinus(request.getPlusMinus());
    }
}
