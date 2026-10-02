package mariano.projects.appVillaSanMartin.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import mariano.projects.appVillaSanMartin.models.dto.PlayerStatsDto;
import mariano.projects.appVillaSanMartin.models.responses.PlayerMatchHistoryResponse;
import mariano.projects.appVillaSanMartin.models.responses.PlayerSeasonStatsResponse;
import mariano.projects.appVillaSanMartin.models.responses.SeasonLeaderResponse;
import mariano.projects.appVillaSanMartin.services.PlayerStatsService;

@RestController
@RequestMapping("/api/stats")
public class PlayerStatsController {
    private final PlayerStatsService playerStatsService;

    public PlayerStatsController(PlayerStatsService playerStatsService) {
        this.playerStatsService = playerStatsService;
    }

    @GetMapping
    public List<PlayerStatsDto> getAll() {
        return playerStatsService.getAll();
    }

    @GetMapping("/player/{playerId}")
    public PlayerStatsDto getByPlayerId(@PathVariable int playerId) {
        return playerStatsService.getByPlayerId(playerId);
    }

    @GetMapping("/leaders")
    public List<SeasonLeaderResponse> getLeaders(
            @RequestParam(required = false) Integer season,
            @RequestParam(required = false) String category) {
        return playerStatsService.getSeasonLeaders(season, category);
    }

    @GetMapping("/players/{playerId}/season")
    public PlayerSeasonStatsResponse getPlayerSeason(
            @PathVariable Integer playerId,
            @RequestParam(required = false) Integer season) {
        return playerStatsService.getPlayerSeasonStats(playerId, season);
    }

    @GetMapping("/players/{playerId}/history")
    public List<PlayerMatchHistoryResponse> getPlayerHistory(
            @PathVariable Integer playerId,
            @RequestParam(required = false) Integer season) {
        return playerStatsService.getPlayerMatchHistory(playerId, season);
    }
}
