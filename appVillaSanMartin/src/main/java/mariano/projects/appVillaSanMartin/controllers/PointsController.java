package mariano.projects.appVillaSanMartin.controllers;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import mariano.projects.appVillaSanMartin.entities.UserEntity;
import mariano.projects.appVillaSanMartin.models.dto.PointsAccountDto;
import mariano.projects.appVillaSanMartin.models.dto.PointsTransactionDto;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;
import mariano.projects.appVillaSanMartin.services.PointsService;

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
    public PointsAccountDto getMyAccount(Authentication auth) {
        return pointsService.getAccountDto(getUser(auth).getId());
    }

    @GetMapping("/transactions")
    public List<PointsTransactionDto> getTransactions(Authentication auth) {
        return pointsService.getTransactions(getUser(auth).getId());
    }

    @GetMapping("/leaderboard")
    public List<PointsAccountDto> getLeaderboard() {
        return pointsService.getLeaderboard();
    }
}
