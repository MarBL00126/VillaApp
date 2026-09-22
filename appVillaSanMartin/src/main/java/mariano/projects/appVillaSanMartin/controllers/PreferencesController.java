package mariano.projects.appVillaSanMartin.controllers;
import mariano.projects.appVillaSanMartin.entities.UserEntity;
import mariano.projects.appVillaSanMartin.entities.UserPreferencesEntity;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;
import mariano.projects.appVillaSanMartin.services.PreferencesService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/preferences")
@RequiredArgsConstructor
public class PreferencesController {
    private final PreferencesService preferencesService;
    private final UserRepository userRepository;
    private UserEntity getUser(Authentication auth) {
        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
    @GetMapping
    public UserPreferencesEntity getMyPreferences(Authentication auth) {
        return preferencesService.getMyPreferences(getUser(auth).getId());
    }
    @PutMapping
    public UserPreferencesEntity updatePreferences(Authentication auth, @RequestBody UserPreferencesEntity body) {
        return preferencesService.updatePreferences(getUser(auth).getId(), body);
    }
    @PutMapping("/favorite-player/{playerId}")
    public UserPreferencesEntity setFavoritePlayer(Authentication auth, @PathVariable int playerId) {
        return preferencesService.setFavoritePlayer(getUser(auth).getId(), playerId);
    }
}
