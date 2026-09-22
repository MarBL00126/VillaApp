package mariano.projects.appVillaSanMartin.controllers;

import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;
import mariano.projects.appVillaSanMartin.services.CommunityService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {
    private final CommunityService communityService;
    private final UserRepository userRepository;

    private UserEntity getUser(Authentication auth) {
        UserDetails details = (UserDetails) auth.getPrincipal();
        return userRepository.findByEmail(details.getUsername()).orElseThrow();
    }

    @GetMapping
    public List<CommentEntity> getComments(@RequestParam String targetType, @RequestParam int targetId) {
        return communityService.getComments(targetType, targetId);
    }

    @GetMapping("/fan-wall")
    public List<CommentEntity> getFanWall() {
        return communityService.getFanWall();
    }

    @PostMapping
    public CommentEntity addComment(@RequestBody Map<String, Object> body, Authentication auth) {
        return communityService.addComment(
            getUser(auth).getId(),
            String.valueOf(body.get("targetType")),
            Integer.parseInt(String.valueOf(body.get("targetId"))),
            String.valueOf(body.get("content"))
        );
    }

    @DeleteMapping("/{id}")
    public void deleteComment(@PathVariable int id, Authentication auth) {
        communityService.deleteComment(getUser(auth).getId(), id);
    }
}
