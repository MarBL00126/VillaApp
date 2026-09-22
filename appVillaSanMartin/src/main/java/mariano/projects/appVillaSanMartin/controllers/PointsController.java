package mariano.projects.appVillaSanMartin.controllers;

import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;
import mariano.projects.appVillaSanMartin.services.PointsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/points")
@RequiredArgsConstructor
public class PointsController {
    private final PointsService pointsService;
    private final UserRepository userRepository;

    private UserEntity getUser(Authentication auth) {
        UserDetails details = (UserDetails) auth.getPrincipal();
        return userRepository.findByEmail(details.getUsername()).orElseThrow();
    }

    @GetMapping
    public PointsAccountEntity getMyAccount(Authentication auth) {
        return pointsService.getOrCreateAccount(getUser(auth).getId());
    }

    @GetMapping("/transactions")
    public List<PointsTransactionEntity> getTransactions(Authentication auth) {
        return pointsService.getTransactions(getUser(auth).getId());
    }

    @GetMapping("/leaderboard")
    public List<PointsAccountEntity> getLeaderboard() {
        return pointsService.getLeaderboard();
    }
}
