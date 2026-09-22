package mariano.projects.appVillaSanMartin.controllers;

import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;
import mariano.projects.appVillaSanMartin.services.PredictionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/predictions")
@RequiredArgsConstructor
public class PredictionController {
    private final PredictionService predictionService;
    private final UserRepository userRepository;

    private UserEntity getUser(Authentication auth) {
        UserDetails details = (UserDetails) auth.getPrincipal();
        return userRepository.findByEmail(details.getUsername()).orElseThrow();
    }

    @GetMapping("/match/{matchId}")
    public List<MatchPredictionEntity> getForMatch(@PathVariable int matchId) {
        return predictionService.getForMatch(matchId);
    }

    @PostMapping
    public MatchPredictionEntity predict(@RequestBody Map<String, Integer> body, Authentication auth) {
        return predictionService.predict(
            getUser(auth).getId(),
            body.get("matchId"),
            body.get("predictedHomeScore"),
            body.get("predictedAwayScore")
        );
    }
}
