package mariano.projects.appVillaSanMartin.controllers;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import mariano.projects.appVillaSanMartin.entities.UserEntity;
import mariano.projects.appVillaSanMartin.models.dto.RewardDto;
import mariano.projects.appVillaSanMartin.models.dto.RewardRedemptionDto;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;
import mariano.projects.appVillaSanMartin.services.RewardService;

@RestController
@RequestMapping("/api/rewards")
@RequiredArgsConstructor
public class RewardController {
    private final RewardService rewardService;
    private final UserRepository userRepository;

    private UserEntity getUser(Authentication auth) {
        UserDetails details = (UserDetails) auth.getPrincipal();
        return userRepository.findByEmail(details.getUsername()).orElseThrow();
    }

    @GetMapping
    public List<RewardDto> getRewards() {
        return rewardService.getActive();
    }

    @GetMapping("/my")
    public List<RewardRedemptionDto> getMyRedemptions(Authentication auth) {
        return rewardService.getMyRedemptions(getUser(auth).getId());
    }

    @PostMapping("/{id}/redeem")
    public RewardRedemptionDto redeem(@PathVariable int id, Authentication auth) {
        return rewardService.redeem(getUser(auth).getId(), id);
    }
}
