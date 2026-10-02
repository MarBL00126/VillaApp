package mariano.projects.appVillaSanMartin.services;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import mariano.projects.appVillaSanMartin.entities.BoxScoreEntity;
import mariano.projects.appVillaSanMartin.models.dto.PlayerStatsDto;
import mariano.projects.appVillaSanMartin.models.responses.PlayerMatchHistoryResponse;
import mariano.projects.appVillaSanMartin.models.responses.PlayerSeasonStatsResponse;
import mariano.projects.appVillaSanMartin.models.responses.SeasonLeaderResponse;
import mariano.projects.appVillaSanMartin.repositories.BoxScoreRepository;
import mariano.projects.appVillaSanMartin.repositories.PlayerStatsRepository;

@Service
public class PlayerStatsService {
    private final PlayerStatsRepository playerStatsRepository;
    private final BoxScoreRepository boxScoreRepository;
    private final BoxScoreService boxScoreService;

    public PlayerStatsService(
            PlayerStatsRepository playerStatsRepository,
            BoxScoreRepository boxScoreRepository,
            BoxScoreService boxScoreService) {
        this.playerStatsRepository = playerStatsRepository;
        this.boxScoreRepository = boxScoreRepository;
        this.boxScoreService = boxScoreService;
    }

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "player-stats-all")
    public List<PlayerStatsDto> getAll() {
        return playerStatsRepository.findAll().stream()
                .map(PlayerStatsDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "player-stats-by-player", key = "#playerId")
    public PlayerStatsDto getByPlayerId(int playerId) {
        return playerStatsRepository.findByPlayer_Id(playerId)
                .map(PlayerStatsDto::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Stats not found for player"));
    }

    public List<SeasonLeaderResponse> getSeasonLeaders(Integer season, String category) {
        int selectedSeason = season != null ? season : LocalDate.now().getYear();
        String selectedCategory = category == null || category.isBlank() ? "points" : category;
        List<BoxScoreEntity> scores = boxScoreRepository.findByMatch_MatchDateBetween(
                seasonStart(selectedSeason),
                seasonEnd(selectedSeason));

        Map<Integer, List<BoxScoreEntity>> byPlayer = scores.stream()
                .collect(Collectors.groupingBy(
                        item -> item.getPlayer().getId(),
                        LinkedHashMap::new,
                        Collectors.toList()));

        return byPlayer.values().stream()
                .map(items -> toLeader(items, selectedSeason, selectedCategory))
                .sorted(Comparator.comparing(SeasonLeaderResponse::getTotal).reversed())
                .limit(10)
                .collect(Collectors.toList());
    }

    public PlayerSeasonStatsResponse getPlayerSeasonStats(Integer playerId, Integer season) {
        int selectedSeason = season != null ? season : LocalDate.now().getYear();
        List<BoxScoreEntity> scores = getPlayerSeasonScores(playerId, selectedSeason);
        if (scores.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Season stats not found for player");
        }

        BoxScoreEntity first = scores.get(0);
        int games = scores.size();
        BigDecimal minutes = sumDecimal(scores, "minutes");
        BigDecimal points = sumInteger(scores, "points");
        BigDecimal rebounds = sumInteger(scores, "rebounds");
        BigDecimal assists = sumInteger(scores, "assists");
        BigDecimal steals = sumInteger(scores, "steals");
        BigDecimal blocks = sumInteger(scores, "blocks");
        BigDecimal turnovers = sumInteger(scores, "turnovers");
        BigDecimal fouls = sumInteger(scores, "fouls");

        return new PlayerSeasonStatsResponse(
                first.getPlayer().getId(),
                first.getPlayer().getName() + " " + first.getPlayer().getSurname(),
                selectedSeason,
                games,
                minutes,
                points,
                rebounds,
                assists,
                steals,
                blocks,
                turnovers,
                fouls,
                average(points, games),
                average(rebounds, games),
                average(assists, games));
    }

    public List<PlayerMatchHistoryResponse> getPlayerMatchHistory(Integer playerId, Integer season) {
        int selectedSeason = season != null ? season : LocalDate.now().getYear();
        return getPlayerSeasonScores(playerId, selectedSeason).stream()
                .sorted(Comparator.comparing(item -> item.getMatch().getMatchDate()))
                .map(item -> new PlayerMatchHistoryResponse(
                        item.getMatch().getId(),
                        item.getMatch().getMatchDate(),
                        item.getMatch().getOpponent(),
                        item.getMatch().isLocal(),
                        boxScoreService.toResponse(item)))
                .collect(Collectors.toList());
    }

    private List<BoxScoreEntity> getPlayerSeasonScores(Integer playerId, Integer season) {
        return boxScoreRepository.findByPlayer_IdAndMatch_MatchDateBetween(
                playerId,
                seasonStart(season),
                seasonEnd(season));
    }

    private SeasonLeaderResponse toLeader(List<BoxScoreEntity> scores, Integer season, String category) {
        BoxScoreEntity first = scores.get(0);
        BigDecimal total = scores.stream()
                .map(item -> BigDecimal.valueOf(categoryValue(item, category)))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return new SeasonLeaderResponse(
                first.getPlayer().getId(),
                first.getPlayer().getName() + " " + first.getPlayer().getSurname(),
                season,
                category,
                total,
                average(total, scores.size()),
                scores.size());
    }

    private int categoryValue(BoxScoreEntity item, String category) {
        return switch (category) {
            case "rebounds" -> item.getRebounds();
            case "assists" -> item.getAssists();
            case "steals" -> item.getSteals();
            case "blocks" -> item.getBlocks();
            case "turnovers" -> item.getTurnovers();
            case "fouls" -> item.getFouls();
            default -> item.getPoints();
        };
    }

    private BigDecimal sumDecimal(List<BoxScoreEntity> scores, String field) {
        if ("minutes".equals(field)) {
            return scores.stream()
                    .map(BoxScoreEntity::getMinutes)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        }
        return BigDecimal.ZERO;
    }

    private BigDecimal sumInteger(List<BoxScoreEntity> scores, String field) {
        return scores.stream()
                .map(item -> BigDecimal.valueOf(switch (field) {
                    case "rebounds" -> item.getRebounds();
                    case "assists" -> item.getAssists();
                    case "steals" -> item.getSteals();
                    case "blocks" -> item.getBlocks();
                    case "turnovers" -> item.getTurnovers();
                    case "fouls" -> item.getFouls();
                    default -> item.getPoints();
                }))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal average(BigDecimal total, int count) {
        if (count == 0) {
            return BigDecimal.ZERO;
        }
        return total.divide(BigDecimal.valueOf(count), 2, RoundingMode.HALF_UP);
    }

    private LocalDateTime seasonStart(Integer season) {
        return LocalDate.of(season, 1, 1).atStartOfDay();
    }

    private LocalDateTime seasonEnd(Integer season) {
        return LocalDate.of(season + 1, 1, 1).atStartOfDay();
    }
}
