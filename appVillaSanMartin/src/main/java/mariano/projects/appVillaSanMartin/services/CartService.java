package mariano.projects.appVillaSanMartin.services;
import lombok.RequiredArgsConstructor;
import mariano.projects.appVillaSanMartin.entities.CartEntity;
import mariano.projects.appVillaSanMartin.entities.CartItemEntity;
import mariano.projects.appVillaSanMartin.entities.ProductEntity;
import mariano.projects.appVillaSanMartin.entities.ProductVariantEntity;
import mariano.projects.appVillaSanMartin.models.dto.CartDto;
import mariano.projects.appVillaSanMartin.models.dto.CartItemDto;
import mariano.projects.appVillaSanMartin.repositories.CartItemRepository;
import mariano.projects.appVillaSanMartin.repositories.CartRepository;
import mariano.projects.appVillaSanMartin.repositories.ProductRepository;
import mariano.projects.appVillaSanMartin.repositories.ProductVariantRepository;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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

    @Transactional
    public CartDto getCartDto(int userId) {
        return CartDto.from(getCart(userId));
    }

    @Transactional
    public CartEntity getCart(int userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            CartEntity newCart = new CartEntity();
            newCart.setUser(userRepository.findById(userId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND)));
            newCart.setCreatedAt(LocalDateTime.now());
            newCart.setUpdatedAt(LocalDateTime.now());
            return cartRepository.save(newCart);
        });
    }

    @Transactional
    public CartItemDto addItemDto(int userId, int productId, Integer variantId, int quantity) {
        return CartItemDto.from(addItem(userId, productId, variantId, quantity));
    }

    @Transactional
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

    @Transactional
    public CartItemDto updateItemDto(int cartItemId, int userId, int quantity) {
        return CartItemDto.from(updateItem(cartItemId, userId, quantity));
    }

    @Transactional
    public CartItemEntity updateItem(int cartItemId, int userId, int quantity) {
        CartItemEntity item = cartItemRepository.findById(cartItemId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (item.getCart().getUser().getId() != userId) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }

    @Transactional
    public void removeItem(int cartItemId, int userId) {
        CartItemEntity item = cartItemRepository.findById(cartItemId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (item.getCart().getUser().getId() != userId) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        cartItemRepository.delete(item);
    }

    @Transactional
    public void clearCart(int userId) {
        cartRepository.findByUserId(userId)
                .ifPresent(cart -> cartItemRepository.deleteByCartId(cart.getId()));
    }
}
