package mariano.projects.appVillaSanMartin.controllers;
import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.services.*;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final CartService cartService;
    private final UserRepository userRepository;

    public CartController(CartService cartService, UserRepository userRepository) {
        this.cartService = cartService;
        this.userRepository = userRepository;
    }

    private UserEntity getUser(Authentication auth) {
        UserDetails details = (UserDetails) auth.getPrincipal();
        return userRepository.findByEmail(details.getUsername()).orElseThrow();
    }

    @GetMapping({"", "/"})
    public CartEntity getCart(Authentication auth) { return cartService.getCart(getUser(auth).getId()); }

    @PostMapping("/items")
    public CartItemEntity addItem(@RequestBody Map<String, Object> body, Authentication auth) {
        int productId = (int) body.get("productId");
        Integer variantId = body.get("variantId") != null ? (Integer) body.get("variantId") : null;
        int quantity = body.get("quantity") != null ? (int) body.get("quantity") : 1;
        return cartService.addItem(getUser(auth).getId(), productId, variantId, quantity);
    }

    @PutMapping("/items/{itemId}")
    public CartItemEntity updateItem(@PathVariable int itemId, @RequestBody Map<String, Integer> body, Authentication auth) {
        return cartService.updateItem(itemId, getUser(auth).getId(), body.get("quantity"));
    }

    @DeleteMapping("/items/{itemId}")
    public void removeItem(@PathVariable int itemId, Authentication auth) {
        cartService.removeItem(itemId, getUser(auth).getId());
    }

    @DeleteMapping({"", "/"})
    public void clearCart(Authentication auth) {
        cartService.clearCart(getUser(auth).getId());
    }
}
