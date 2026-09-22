package mariano.projects.appVillaSanMartin.controllers;

import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;
import mariano.projects.appVillaSanMartin.services.TriviaService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.Collection;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trivia")
@RequiredArgsConstructor
public class TriviaController {
    private final TriviaService triviaService;
    private final UserRepository userRepository;

    private UserEntity getUser(Authentication auth) {
        UserDetails details = (UserDetails) auth.getPrincipal();
        return userRepository.findByEmail(details.getUsername()).orElseThrow();
    }

    @GetMapping
    public List<TriviaEntity> getActive() {
        return triviaService.getActive();
    }

    @GetMapping("/{id}")
    public Map<String, Object> getDetail(@PathVariable int id) {
        return triviaService.getDetail(id);
    }

    @PostMapping("/{id}/submit")
    public TriviaAttemptEntity submit(@PathVariable int id, @RequestBody Map<String, Collection<Integer>> body, Authentication auth) {
        return triviaService.submit(getUser(auth).getId(), id, body.get("selectedOptionIds"));
    }
}
