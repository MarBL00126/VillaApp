package mariano.projects.appVillaSanMartin.controllers;

import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;
import mariano.projects.appVillaSanMartin.services.RewardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

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
    public List<RewardEntity> getRewards() {
        return rewardService.getActive();
    }

    @GetMapping("/my")
    public List<RewardRedemptionEntity> getMyRedemptions(Authentication auth) {
        return rewardService.getMyRedemptions(getUser(auth).getId());
    }

    @PostMapping("/{id}/redeem")
    public RewardRedemptionEntity redeem(@PathVariable int id, Authentication auth) {
        return rewardService.redeem(getUser(auth).getId(), id);
    }
}
