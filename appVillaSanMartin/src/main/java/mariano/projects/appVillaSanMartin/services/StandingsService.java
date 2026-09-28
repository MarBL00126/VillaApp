package mariano.projects.appVillaSanMartin.services;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import mariano.projects.appVillaSanMartin.entities.StandingsEntity;
import mariano.projects.appVillaSanMartin.entities.TeamEntity;
import mariano.projects.appVillaSanMartin.models.requests.StandingRequest;
import mariano.projects.appVillaSanMartin.models.responses.StandingResponse;
import mariano.projects.appVillaSanMartin.repositories.StandingsRepository;
import mariano.projects.appVillaSanMartin.repositories.TeamRepository;

@Service
public class StandingsService {
    private final StandingsRepository standingsRepository;
    private final TeamRepository teamRepository;

    public StandingsService(StandingsRepository standingsRepository, TeamRepository teamRepository) {
        this.standingsRepository = standingsRepository;
        this.teamRepository = teamRepository;
    }

    public List<StandingResponse> getBySeason(Integer season, String zone) {
        int selectedSeason = season != null ? season : LocalDate.now().getYear();
        List<StandingsEntity> rows = zone == null || zone.isBlank()
                ? standingsRepository.findBySeasonOrderByPositionAsc(selectedSeason)
                : standingsRepository.findBySeasonAndZoneOrderByPositionAsc(selectedSeason, zone);

        return rows.stream()
                .sorted(Comparator.comparing(StandingsEntity::getPosition, Comparator.nullsLast(Integer::compareTo))
                        .thenComparing(StandingsEntity::getWins, Comparator.nullsLast(Comparator.reverseOrder()))
                        .thenComparing(this::pointDifference, Comparator.reverseOrder()))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public StandingResponse create(StandingRequest request) {
        StandingsEntity entity = new StandingsEntity();
        apply(entity, request);
        return toResponse(standingsRepository.save(entity));
    }

    public StandingResponse update(Integer id, StandingRequest request) {
        StandingsEntity entity = standingsRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Standing not found"));
        apply(entity, request);
        return toResponse(standingsRepository.save(entity));
    }

    private void apply(StandingsEntity entity, StandingRequest request) {
        if (request.getTeamName() != null) entity.setTeamName(request.getTeamName());
        if (request.getSeason() != null) entity.setSeason(request.getSeason());
        if (request.getZone() != null) entity.setZone(request.getZone());
        if (request.getPlayed() != null) entity.setPlayed(request.getPlayed());
        if (request.getWins() != null) entity.setWins(request.getWins());
        if (request.getLosses() != null) entity.setLosses(request.getLosses());
        if (request.getPointsFor() != null) entity.setPointsFor(request.getPointsFor());
        if (request.getPointsAgainst() != null) entity.setPointsAgainst(request.getPointsAgainst());
        if (request.getStreak() != null) entity.setStreak(request.getStreak());
        if (request.getPosition() != null) entity.setPosition(request.getPosition());
        if (request.getTeamId() != null) {
            TeamEntity team = teamRepository.findById(request.getTeamId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found"));
            entity.setTeam(team);
            if (entity.getTeamName() == null || entity.getTeamName().isBlank()) {
                entity.setTeamName(team.getName());
            }
        }
    }

    private StandingResponse toResponse(StandingsEntity entity) {
        return new StandingResponse(
                entity.getId(),
                entity.getTeamName(),
                entity.getTeam() != null ? entity.getTeam().getId() : null,
                entity.getSeason(),
                entity.getZone(),
                entity.getPlayed(),
                entity.getWins(),
                entity.getLosses(),
                entity.getPointsFor(),
                entity.getPointsAgainst(),
                pointDifference(entity),
                entity.getStreak(),
                entity.getPosition());
    }

    private Integer pointDifference(StandingsEntity entity) {
        return entity.getPointsFor() - entity.getPointsAgainst();
    }
}
