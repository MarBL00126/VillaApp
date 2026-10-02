package mariano.projects.appVillaSanMartin.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import mariano.projects.appVillaSanMartin.entities.UserEntity;
import mariano.projects.appVillaSanMartin.models.dto.FavoritePlayerResponseDto;
import mariano.projects.appVillaSanMartin.models.dto.PageResponses;
import mariano.projects.appVillaSanMartin.models.dto.PlayerDto;
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
    public ResponseEntity<List<PlayerDto>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return PageResponses.of(playerService.getAll(PageResponses.pageable(page, size)));
    }

    @GetMapping("/{id}")
    public PlayerDto getById(@PathVariable int id) {
        return playerService.getById(id);
    }

    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<PlayerDto>> getByTeam(
            @PathVariable int teamId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return PageResponses.of(playerService.getByTeam(teamId, PageResponses.pageable(page, size)));
    }

    @PostMapping("/{id}/favorite")
    public FavoritePlayerResponseDto favorite(@PathVariable int id, Authentication auth) {
        return FavoritePlayerResponseDto.from(preferencesService.setFavoritePlayer(getUser(auth).getId(), id));
    }

    @DeleteMapping("/{id}/favorite")
    public FavoritePlayerResponseDto unfavorite(@PathVariable int id, Authentication auth) {
        return FavoritePlayerResponseDto.from(preferencesService.clearFavoritePlayer(getUser(auth).getId(), id));
    }
}
