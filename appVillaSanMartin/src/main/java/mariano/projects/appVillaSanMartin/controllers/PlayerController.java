package mariano.projects.appVillaSanMartin.controllers;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mariano.projects.appVillaSanMartin.entities.PlayerEntity;
import mariano.projects.appVillaSanMartin.entities.UserEntity;
import mariano.projects.appVillaSanMartin.entities.UserPreferencesEntity;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;
import mariano.projects.appVillaSanMartin.services.PlayerService;
import mariano.projects.appVillaSanMartin.services.PreferencesService;

@RestController
@RequestMapping("/api/players")
public class PlayerController {
    private final PlayerService playerService;
    private final PreferencesService preferencesService;
    private final UserRepository userRepository;

    public PlayerController(PlayerService playerService, PreferencesService preferencesService, UserRepository userRepository) {
        this.playerService = playerService;
        this.preferencesService = preferencesService;
        this.userRepository = userRepository;
    }

    private UserEntity getUser(Authentication auth) {
        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
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

    @PostMapping("/{id}/favorite")
    public UserPreferencesEntity favorite(@PathVariable int id, Authentication auth) {
        return preferencesService.setFavoritePlayer(getUser(auth).getId(), id);
    }

    @DeleteMapping("/{id}/favorite")
    public UserPreferencesEntity unfavorite(@PathVariable int id, Authentication auth) {
        return preferencesService.clearFavoritePlayer(getUser(auth).getId(), id);
    }
}
