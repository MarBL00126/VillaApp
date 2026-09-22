package mariano.projects.appVillaSanMartin.controllers;
import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.services.*;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/favorites/products")
public class FavoriteProductController {
    private final FavoriteProductService favService;
    private final UserRepository userRepository;

    public FavoriteProductController(FavoriteProductService favService, UserRepository userRepository) {
        this.favService = favService;
        this.userRepository = userRepository;
    }

    private UserEntity getUser(Authentication auth) {
        UserDetails details = (UserDetails) auth.getPrincipal();
        return userRepository.findByEmail(details.getUsername()).orElseThrow();
    }

    @GetMapping({"", "/"})
    public List<FavoriteProductEntity> getFavorites(Authentication auth) {
        return favService.getMyFavorites(getUser(auth).getId());
    }

    @PostMapping("/{productId}")
    public void addFavorite(@PathVariable int productId, Authentication auth) {
        favService.addFavorite(getUser(auth).getId(), productId);
    }

    @DeleteMapping("/{productId}")
    public void removeFavorite(@PathVariable int productId, Authentication auth) {
        favService.removeFavorite(getUser(auth).getId(), productId);
    }
}
