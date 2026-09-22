package mariano.projects.appVillaSanMartin.services;
import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.util.Optional;
@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;
    
    public CartEntity getCart(int userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            CartEntity newCart = new CartEntity();
            newCart.setUser(userRepository.findById(userId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND)));
            newCart.setCreatedAt(LocalDateTime.now());
            newCart.setUpdatedAt(LocalDateTime.now());
            return cartRepository.save(newCart);
        });
    }
    public CartItemEntity addItem(int userId, int productId, Integer variantId, int quantity) {
        CartEntity cart = getCart(userId);
        ProductEntity product = productRepository.findById(productId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        ProductVariantEntity variant = null;
        if (variantId != null) {
            variant = variantRepository.findById(variantId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
            if (variant.getStock() < quantity) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Stock insuficiente");
        }
        Optional<CartItemEntity> existing = cartItemRepository.findByCartIdAndProductIdAndVariantId(cart.getId(), productId, variantId);
        if (existing.isPresent()) {
            CartItemEntity item = existing.get();
            item.setQuantity(item.getQuantity() + quantity);
            return cartItemRepository.save(item);
        } else {
            CartItemEntity item = new CartItemEntity();
            item.setCart(cart);
            item.setProduct(product);
            item.setVariant(variant);
            item.setQuantity(quantity);
            item.setUnitPrice(product.getPrice());
            return cartItemRepository.save(item);
        }
    }
    public CartItemEntity updateItem(int cartItemId, int userId, int quantity) {
        CartItemEntity item = cartItemRepository.findById(cartItemId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (item.getCart().getUser().getId() != userId) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }
    public void removeItem(int cartItemId, int userId) {
        CartItemEntity item = cartItemRepository.findById(cartItemId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (item.getCart().getUser().getId() != userId) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        cartItemRepository.delete(item);
    }
    public void clearCart(int userId) {
        CartEntity cart = getCart(userId);
        cartItemRepository.deleteAll(cart.getItems());
    }
}
