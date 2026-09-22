package mariano.projects.appVillaSanMartin.controllers;

import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/badges")
@RequiredArgsConstructor
public class BadgeController {
    private final BadgeRepository badgeRepository;
    private final UserBadgeRepository userBadgeRepository;
    private final UserRepository userRepository;

    private UserEntity getUser(Authentication auth) {
        UserDetails details = (UserDetails) auth.getPrincipal();
        return userRepository.findByEmail(details.getUsername()).orElseThrow();
    }

    @GetMapping
    public List<BadgeEntity> getAll() {
        return badgeRepository.findByActiveTrueOrderByRequiredPointsAsc();
    }

    @GetMapping("/my")
    public List<UserBadgeEntity> getMyBadges(Authentication auth) {
        return userBadgeRepository.findByUser_IdOrderByEarnedAtDesc(getUser(auth).getId());
    }
}
