package mariano.projects.appVillaSanMartin.controllers;

import mariano.projects.appVillaSanMartin.entities.PollEntity;
import mariano.projects.appVillaSanMartin.entities.PollVoteEntity;
import mariano.projects.appVillaSanMartin.entities.UserEntity;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;
import mariano.projects.appVillaSanMartin.services.PollService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mvp")
@RequiredArgsConstructor
public class MvpController {
    private final PollService pollService;
    private final UserRepository userRepository;

    private UserEntity getUser(Authentication auth) {
        UserDetails details = (UserDetails) auth.getPrincipal();
        return userRepository.findByEmail(details.getUsername()).orElseThrow();
    }

    @GetMapping("/match/{matchId}")
    public List<PollEntity> getMvpPolls(@PathVariable int matchId) {
        return pollService.getMvpByMatch(matchId);
    }

    @PostMapping("/vote")
    public PollVoteEntity vote(@RequestBody Map<String, Integer> body, Authentication auth) {
        return pollService.vote(getUser(auth).getId(), body.get("pollId"), body.get("optionId"));
    }
}
