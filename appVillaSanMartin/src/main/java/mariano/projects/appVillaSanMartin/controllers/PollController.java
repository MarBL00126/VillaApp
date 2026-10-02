package mariano.projects.appVillaSanMartin.controllers;

import mariano.projects.appVillaSanMartin.entities.UserEntity;
import mariano.projects.appVillaSanMartin.models.dto.PollDetailDto;
import mariano.projects.appVillaSanMartin.models.dto.PollDto;
import mariano.projects.appVillaSanMartin.models.dto.PollVoteDto;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;
import mariano.projects.appVillaSanMartin.services.PollService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/polls")
@RequiredArgsConstructor
public class PollController {
    private final PollService pollService;
    private final UserRepository userRepository;

    private UserEntity getUser(Authentication auth) {
        UserDetails details = (UserDetails) auth.getPrincipal();
        return userRepository.findByEmail(details.getUsername()).orElseThrow();
    }

    @GetMapping
    public List<PollDto> getActive() {
        return pollService.getActive();
    }

    @GetMapping("/{id}")
    public PollDetailDto getDetail(@PathVariable int id) {
        return pollService.getDetail(id);
    }

    @PostMapping("/{id}/vote")
    public PollVoteDto vote(@PathVariable int id, @RequestBody Map<String, Integer> body, Authentication auth) {
        return pollService.vote(getUser(auth).getId(), id, body.get("optionId"));
    }
}
