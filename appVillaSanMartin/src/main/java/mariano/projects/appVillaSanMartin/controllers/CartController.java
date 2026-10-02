package mariano.projects.appVillaSanMartin.controllers;
import mariano.projects.appVillaSanMartin.entities.UserEntity;
import mariano.projects.appVillaSanMartin.models.dto.CartDto;
import mariano.projects.appVillaSanMartin.models.dto.CartItemDto;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;
import mariano.projects.appVillaSanMartin.services.CartService;
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
    public CartDto getCart(Authentication auth) { return cartService.getCartDto(getUser(auth).getId()); }

    @PostMapping("/items")
    public CartItemDto addItem(@RequestBody Map<String, Object> body, Authentication auth) {
        int productId = (int) body.get("productId");
        Integer variantId = body.get("variantId") != null ? (Integer) body.get("variantId") : null;
        int quantity = body.get("quantity") != null ? (int) body.get("quantity") : 1;
        return cartService.addItemDto(getUser(auth).getId(), productId, variantId, quantity);
    }

    @PutMapping("/items/{itemId}")
    public CartItemDto updateItem(@PathVariable int itemId, @RequestBody Map<String, Integer> body, Authentication auth) {
        return cartService.updateItemDto(itemId, getUser(auth).getId(), body.get("quantity"));
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
