package mariano.projects.appVillaSanMartin.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mariano.projects.appVillaSanMartin.entities.PlayerEntity;
import mariano.projects.appVillaSanMartin.services.PlayerService;

@RestController
@RequestMapping("/api/players")
public class PlayerController {
    private final PlayerService playerService;

    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @GetMapping
    public List<PlayerEntity> getAll() {
        return playerService.getAll();
    }

    @GetMapping("/{id}")
    public PlayerEntity getById(@PathVariable int id) {
        return playerService.getById(id);
    }

    @GetMapping("/team/{teamId}")
    public List<PlayerEntity> getByTeam(@PathVariable int teamId) {
        return playerService.getByTeam(teamId);
    }
}
