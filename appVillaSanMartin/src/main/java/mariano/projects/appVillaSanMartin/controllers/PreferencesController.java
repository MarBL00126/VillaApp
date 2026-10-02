package mariano.projects.appVillaSanMartin.controllers;
import mariano.projects.appVillaSanMartin.entities.UserEntity;
import mariano.projects.appVillaSanMartin.models.dto.UserPreferencesDto;
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

    record UpdatePreferencesRequest(
            Boolean notifyNews,
            Boolean notifyVideos,
            Boolean notifyFees,
            Boolean notifyBenefits,
            Boolean notifyMatchResults) {
    }

    @GetMapping
    public UserPreferencesDto getMyPreferences(Authentication auth) {
        return preferencesService.getMyPreferencesDto(getUser(auth).getId());
    }

    @PutMapping
    public UserPreferencesDto updatePreferences(Authentication auth, @RequestBody UpdatePreferencesRequest body) {
        return preferencesService.updatePreferencesDto(
            getUser(auth).getId(),
            body.notifyNews(),
            body.notifyVideos(),
            body.notifyFees(),
            body.notifyBenefits(),
            body.notifyMatchResults()
        );
    }

    @PutMapping("/favorite-player/{playerId}")
    public UserPreferencesDto setFavoritePlayer(Authentication auth, @PathVariable int playerId) {
        return preferencesService.setFavoritePlayerDto(getUser(auth).getId(), playerId);
    }
}
