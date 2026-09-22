package mariano.projects.appVillaSanMartin.controllers;
import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.services.*;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/favorites/news")
public class FavoriteNewsController {
    private final FavoriteNewsService favService;
    private final UserRepository userRepository;

    public FavoriteNewsController(FavoriteNewsService favService, UserRepository userRepository) {
        this.favService = favService;
        this.userRepository = userRepository;
    }

    private UserEntity getUser(Authentication auth) {
        UserDetails details = (UserDetails) auth.getPrincipal();
        return userRepository.findByEmail(details.getUsername()).orElseThrow();
    }

    @GetMapping({"", "/"})
    public List<FavoriteNewsEntity> getFavorites(Authentication auth) {
        return favService.getMyFavorites(getUser(auth).getId());
    }

    @PostMapping("/{newsId}")
    public void addFavorite(@PathVariable int newsId, Authentication auth) {
        favService.addFavorite(getUser(auth).getId(), newsId);
    }

    @DeleteMapping("/{newsId}")
    public void removeFavorite(@PathVariable int newsId, Authentication auth) {
        favService.removeFavorite(getUser(auth).getId(), newsId);
    }
}
