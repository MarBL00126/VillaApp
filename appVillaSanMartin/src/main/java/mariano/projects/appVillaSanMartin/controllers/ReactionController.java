package mariano.projects.appVillaSanMartin.controllers;

import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;
import mariano.projects.appVillaSanMartin.services.CommunityService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/reactions")
@RequiredArgsConstructor
public class ReactionController {
    private final CommunityService communityService;
    private final UserRepository userRepository;

    private UserEntity getUser(Authentication auth) {
        UserDetails details = (UserDetails) auth.getPrincipal();
        return userRepository.findByEmail(details.getUsername()).orElseThrow();
    }

    @GetMapping
    public Map<String, Long> getCounts(@RequestParam String targetType, @RequestParam int targetId) {
        return communityService.getReactionCounts(targetType, targetId);
    }

    @PostMapping
    public ReactionEntity react(@RequestBody Map<String, Object> body, Authentication auth) {
        return communityService.react(
            getUser(auth).getId(),
            String.valueOf(body.get("targetType")),
            Integer.parseInt(String.valueOf(body.get("targetId"))),
            String.valueOf(body.get("type"))
        );
    }
}
