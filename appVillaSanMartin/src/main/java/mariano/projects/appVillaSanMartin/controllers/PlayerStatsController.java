package mariano.projects.appVillaSanMartin.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mariano.projects.appVillaSanMartin.entities.PlayerStatsEntity;
import mariano.projects.appVillaSanMartin.services.PlayerStatsService;

@RestController
@RequestMapping("/stats")
public class PlayerStatsController {
    private final PlayerStatsService playerStatsService;

    public PlayerStatsController(PlayerStatsService playerStatsService) {
        this.playerStatsService = playerStatsService;
    }

    @GetMapping
    public List<PlayerStatsEntity> getAll() {
        return playerStatsService.getAll();
    }

    @GetMapping("/player/{playerId}")
    public PlayerStatsEntity getByPlayerId(@PathVariable int playerId) {
        return playerStatsService.getByPlayerId(playerId);
    }
}
