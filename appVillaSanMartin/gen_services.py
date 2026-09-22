import os

base_pkg = "mariano.projects.appVillaSanMartin"
base_dir = "src/main/java/mariano/projects/appVillaSanMartin"

def create_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")

services_dir = f"{base_dir}/services"

services = {
    "ProductService.java": """
package mariano.projects.appVillaSanMartin.services;
import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductCategoryRepository categoryRepository;
    private final ProductVariantRepository variantRepository;
    public List<ProductEntity> getAll() { return productRepository.findAll(); }
    public List<ProductEntity> getAllActive() { return productRepository.findByActiveTrue(); }
    public ProductEntity getById(int id) {
        return productRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }
    public List<ProductEntity> getByCategory(String slug) {
        ProductCategoryEntity cat = categoryRepository.findBySlug(slug).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return productRepository.findByCategoryIdAndActiveTrue(cat.getId());
    }
    public List<ProductVariantEntity> getVariants(int productId) {
        return variantRepository.findByProductId(productId);
    }
}
""",
    "CartService.java": """
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
        if (!item.getCart().getUser().getId().equals(userId)) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }
    public void removeItem(int cartItemId, int userId) {
        CartItemEntity item = cartItemRepository.findById(cartItemId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!item.getCart().getUser().getId().equals(userId)) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        cartItemRepository.delete(item);
    }
    public void clearCart(int userId) {
        CartEntity cart = getCart(userId);
        cartItemRepository.deleteAll(cart.getItems());
    }
}
""",
    "CouponService.java": """
package mariano.projects.appVillaSanMartin.services;
import mariano.projects.appVillaSanMartin.entities.CouponEntity;
import mariano.projects.appVillaSanMartin.repositories.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
@Service
@RequiredArgsConstructor
public class CouponService {
    private final CouponRepository couponRepository;
    public CouponEntity validate(String code, BigDecimal amount) {
        CouponEntity coupon = couponRepository.findByCode(code).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cupón no encontrado"));
        if (!coupon.getActive() || (coupon.getExpiresAt() != null && coupon.getExpiresAt().isBefore(LocalDateTime.now()))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cupón inválido o expirado");
        }
        if (coupon.getMaxUses() != null && coupon.getUsedCount() >= coupon.getMaxUses()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cupón agotado");
        }
        if (coupon.getMinAmount() != null && amount.compareTo(coupon.getMinAmount()) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Monto mínimo no alcanzado");
        }
        return coupon;
    }
}
""",
    "ShopOrderService.java": """
package mariano.projects.appVillaSanMartin.services;
import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
@Service
@RequiredArgsConstructor
public class ShopOrderService {
    private final ShopOrderRepository orderRepository;
    private final ShopOrderItemRepository itemRepository;
    private final CartService cartService;
    private final CouponService couponService;
    private final UserRepository userRepository;
    private final CouponRepository couponRepository;

    public ShopOrderEntity createOrder(int userId, String couponCode) {
        CartEntity cart = cartService.getCart(userId);
        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El carrito está vacío");
        }
        BigDecimal subtotal = cart.getItems().stream()
                .map(i -> i.getUnitPrice().multiply(new BigDecimal(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal discount = BigDecimal.ZERO;
        CouponEntity coupon = null;
        if (couponCode != null && !couponCode.isEmpty()) {
            coupon = couponService.validate(couponCode, subtotal);
            discount = subtotal.multiply(coupon.getDiscountPct()).divide(new BigDecimal(100), 2, RoundingMode.HALF_UP);
        }
        
        ShopOrderEntity order = new ShopOrderEntity();
        order.setUser(cart.getUser());
        order.setCoupon(coupon);
        order.setSubtotal(subtotal);
        order.setDiscount(discount);
        order.setTotalAmount(subtotal.subtract(discount));
        order.setStatus("PENDING_PAYMENT");
        order.setCreatedAt(LocalDateTime.now());
        
        ShopOrderEntity savedOrder = orderRepository.save(order);
        
        for (CartItemEntity ci : cart.getItems()) {
            ShopOrderItemEntity oi = new ShopOrderItemEntity();
            oi.setOrder(savedOrder);
            oi.setProduct(ci.getProduct());
            oi.setVariant(ci.getVariant());
            oi.setQuantity(ci.getQuantity());
            oi.setUnitPrice(ci.getUnitPrice());
            itemRepository.save(oi);
        }
        
        cartService.clearCart(userId);
        return savedOrder;
    }
    
    public List<ShopOrderEntity> getMyOrders(int userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    public ShopOrderEntity getOrderById(int id, int userId) {
        ShopOrderEntity order = orderRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!order.getUser().getId().equals(userId)) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        return order;
    }
    
    public void confirmPayment(int orderId, String mpPaymentId) {
        ShopOrderEntity order = orderRepository.findById(orderId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        order.setStatus("PAID");
        order.setMpPaymentId(mpPaymentId);
        order.setPaidAt(LocalDateTime.now());
        if (order.getCoupon() != null) {
            CouponEntity c = order.getCoupon();
            c.setUsedCount(c.getUsedCount() + 1);
            couponRepository.save(c);
        }
        orderRepository.save(order);
    }
}
""",
    "ShopPaymentService.java": """
package mariano.projects.appVillaSanMartin.services;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import lombok.RequiredArgsConstructor;
import mariano.projects.appVillaSanMartin.entities.ShopOrderEntity;
import mariano.projects.appVillaSanMartin.repositories.ShopOrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
@Service
@RequiredArgsConstructor
public class ShopPaymentService {
    private final ShopOrderRepository shopOrderRepository;
    @Transactional
    public String createPreference(Long shopOrderId) throws MPException, MPApiException {
        ShopOrderEntity order = shopOrderRepository.findById(shopOrderId.intValue())
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));
        if (!"PENDING_PAYMENT".equals(order.getStatus())) {
            throw new RuntimeException("La orden no está pendiente de pago");
        }
        PreferenceItemRequest item = PreferenceItemRequest.builder()
                .title("Compra Tienda VSM")
                .quantity(1)
                .unitPrice(order.getTotalAmount())
                .currencyId("ARS")
                .build();
        PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                .success("https://tudominio.com/payment/success?shopOrderId=" + shopOrderId)
                .failure("https://tudominio.com/payment/failure?shopOrderId=" + shopOrderId)
                .pending("https://tudominio.com/payment/pending?shopOrderId=" + shopOrderId)
                .build();
        PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                .items(List.of(item))
                .externalReference(shopOrderId.toString())
                .backUrls(backUrls)
                .notificationUrl("https://tudominio.com/webhooks/mercadopago")
                .build();
        PreferenceClient client = new PreferenceClient();
        Preference preference = client.create(preferenceRequest);
        order.setMpPreferenceId(preference.getId());
        shopOrderRepository.save(order);
        return preference.getInitPoint();
    }
}
""",
    "FavoriteProductService.java": """
package mariano.projects.appVillaSanMartin.services;
import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.util.List;
@Service
@RequiredArgsConstructor
public class FavoriteProductService {
    private final FavoriteProductRepository favRepo;
    private final UserRepository userRepo;
    private final ProductRepository prodRepo;
    public List<FavoriteProductEntity> getMyFavorites(int userId) {
        return favRepo.findByUserId(userId);
    }
    public void addFavorite(int userId, int productId) {
        if (!favRepo.existsByUserIdAndProductId(userId, productId)) {
            FavoriteProductEntity fav = new FavoriteProductEntity();
            fav.setUser(userRepo.findById(userId).orElseThrow());
            fav.setProduct(prodRepo.findById(productId).orElseThrow());
            fav.setCreatedAt(LocalDateTime.now());
            favRepo.save(fav);
        }
    }
    public void removeFavorite(int userId, int productId) {
        favRepo.findByUserIdAndProductId(userId, productId).ifPresent(favRepo::delete);
    }
    public boolean isFavorite(int userId, int productId) {
        return favRepo.existsByUserIdAndProductId(userId, productId);
    }
}
""",
    "NewsService.java": """
package mariano.projects.appVillaSanMartin.services;
import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class NewsService {
    private final NewsRepository newsRepository;
    private final NewsCategoryRepository categoryRepository;
    public List<NewsEntity> getAll() { return newsRepository.findAll(); }
    public List<NewsEntity> getFeatured() { return newsRepository.findByFeaturedTrueOrderByPublishedAtDesc(); }
    public NewsEntity getById(int id) { return newsRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND)); }
    public List<NewsEntity> getByCategory(String slug) {
        NewsCategoryEntity cat = categoryRepository.findBySlug(slug).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return newsRepository.findByCategoryIdOrderByPublishedAtDesc(cat.getId());
    }
    public List<NewsEntity> search(String q) {
        return newsRepository.findByTitleContainingIgnoreCaseOrSummaryContainingIgnoreCase(q, q);
    }
    public List<NewsEntity> getRelated(int newsId) {
        NewsEntity n = getById(newsId);
        if (n.getCategory() == null) return List.of();
        return newsRepository.findByCategoryIdOrderByPublishedAtDesc(n.getCategory().getId())
            .stream().filter(x -> !x.getId().equals(newsId)).limit(3).collect(Collectors.toList());
    }
}
""",
    "FavoriteNewsService.java": """
package mariano.projects.appVillaSanMartin.services;
import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
@Service
@RequiredArgsConstructor
public class FavoriteNewsService {
    private final FavoriteNewsRepository favRepo;
    private final UserRepository userRepo;
    private final NewsRepository newsRepo;
    public List<FavoriteNewsEntity> getMyFavorites(int userId) { return favRepo.findByUserId(userId); }
    public void addFavorite(int userId, int newsId) {
        if (!favRepo.existsByUserIdAndNewsId(userId, newsId)) {
            FavoriteNewsEntity f = new FavoriteNewsEntity();
            f.setUser(userRepo.findById(userId).orElseThrow());
            f.setNews(newsRepo.findById(newsId).orElseThrow());
            f.setCreatedAt(LocalDateTime.now());
            favRepo.save(f);
        }
    }
    public void removeFavorite(int userId, int newsId) {
        favRepo.findAll().stream().filter(f -> f.getUser().getId().equals(userId) && f.getNews().getId().equals(newsId))
            .findFirst().ifPresent(favRepo::delete);
    }
    public boolean isFavorite(int userId, int newsId) { return favRepo.existsByUserIdAndNewsId(userId, newsId); }
}
""",
    "GalleryService.java": """
package mariano.projects.appVillaSanMartin.services;
import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
@Service
@RequiredArgsConstructor
public class GalleryService {
    private final GalleryRepository galleryRepo;
    private final PhotoRepository photoRepo;
    public List<GalleryEntity> getAll() { return galleryRepo.findAllByOrderByEventDateDesc(); }
    public GalleryEntity getById(int id) { return galleryRepo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND)); }
    public List<PhotoEntity> getPhotos(int galleryId) { return photoRepo.findByGalleryIdOrderBySortOrder(galleryId); }
}
""",
    "VideoService.java": """
package mariano.projects.appVillaSanMartin.services;
import mariano.projects.appVillaSanMartin.entities.VideoEntity;
import mariano.projects.appVillaSanMartin.repositories.VideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
@Service
@RequiredArgsConstructor
public class VideoService {
    private final VideoRepository videoRepo;
    public List<VideoEntity> getAll() { return videoRepo.findAllByOrderByPublishedAtDesc(); }
    public List<VideoEntity> getByType(String type) { return videoRepo.findByTypeOrderByPublishedAtDesc(type); }
    public VideoEntity getById(int id) { return videoRepo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND)); }
}
""",
    "CantinaService.java": """
package mariano.projects.appVillaSanMartin.services;
import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class CantinaService {
    private final CantinaInfoRepository infoRepo;
    private final CantinaMenuItemRepository itemRepo;
    private final CantinaMenuCategoryRepository catRepo;
    public CantinaInfoEntity getInfo() {
        return infoRepo.findAll().stream().findFirst().orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }
    public void updateOpenStatus(boolean isOpen) {
        CantinaInfoEntity info = getInfo();
        info.setIsOpen(isOpen);
        infoRepo.save(info);
    }
    public List<CantinaMenuItemEntity> getMenu() { return itemRepo.findByAvailableTrue(); }
    public Map<String, List<CantinaMenuItemEntity>> getMenuByCategory() {
        return itemRepo.findByAvailableTrue().stream().collect(Collectors.groupingBy(i -> i.getCategory().getName()));
    }
    public List<CantinaMenuCategoryEntity> getCategories() { return catRepo.findAllByOrderBySortOrder(); }
}
""",
    "CantinaOrderService.java": """
package mariano.projects.appVillaSanMartin.services;
import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
@Service
@RequiredArgsConstructor
public class CantinaOrderService {
    private final CantinaOrderRepository orderRepo;
    private final CantinaOrderItemRepository itemRepo;
    private final UserRepository userRepo;
    private final CantinaMenuItemRepository menuItemRepo;

    public static class OrderItemRequest {
        public int menuItemId;
        public int quantity;
    }

    public CantinaOrderEntity createOrder(Integer userId, List<OrderItemRequest> items, String paymentMethod, String notes) {
        UserEntity user = null;
        if (userId != null) {
            user = userRepo.findById(userId).orElse(null);
        }
        String orderNumber = "C" + String.format("%06d", System.currentTimeMillis() % 1000000);
        BigDecimal total = BigDecimal.ZERO;
        
        CantinaOrderEntity order = new CantinaOrderEntity();
        order.setUser(user);
        order.setOrderNumber(orderNumber);
        order.setStatus("PENDING");
        order.setPaymentMethod(paymentMethod);
        order.setNotes(notes);
        order.setCreatedAt(LocalDateTime.now());
        
        // We need to save total, but first calculate it.
        for (OrderItemRequest req : items) {
            CantinaMenuItemEntity mi = menuItemRepo.findById(req.menuItemId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
            total = total.add(mi.getPrice().multiply(new BigDecimal(req.quantity)));
        }
        order.setTotalAmount(total);
        CantinaOrderEntity saved = orderRepo.save(order);
        
        for (OrderItemRequest req : items) {
            CantinaMenuItemEntity mi = menuItemRepo.findById(req.menuItemId).get();
            CantinaOrderItemEntity oi = new CantinaOrderItemEntity();
            oi.setOrder(saved);
            oi.setMenuItem(mi);
            oi.setQuantity(req.quantity);
            oi.setUnitPrice(mi.getPrice());
            itemRepo.save(oi);
        }
        return saved;
    }
    public CantinaOrderEntity getByOrderNumber(String orderNumber) {
        return orderRepo.findByOrderNumber(orderNumber).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }
    public List<CantinaOrderEntity> getMyOrders(int userId) { return orderRepo.findByUserIdOrderByCreatedAtDesc(userId); }
    public void updateStatus(String orderNumber, String status) {
        CantinaOrderEntity order = getByOrderNumber(orderNumber);
        order.setStatus(status);
        if ("READY".equals(status)) {
            order.setReadyAt(LocalDateTime.now());
        }
        orderRepo.save(order);
    }
}
"""
}

for filename, content in services.items():
    create_file(f"{services_dir}/{filename}", content)

print("Services generated.")
