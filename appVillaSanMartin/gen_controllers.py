import os

base_pkg = "mariano.projects.appVillaSanMartin"
base_dir = "src/main/java/mariano/projects/appVillaSanMartin"

def create_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")

controllers_dir = f"{base_dir}/controllers"

controllers = {
    "ProductController.java": """
package mariano.projects.appVillaSanMartin.controllers;
import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.services.*;
import mariano.projects.appVillaSanMartin.repositories.ProductCategoryRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;
    private final ProductCategoryRepository categoryRepository;

    public ProductController(ProductService productService, ProductCategoryRepository categoryRepository) {
        this.productService = productService;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping("/")
    public List<ProductEntity> getAll() { return productService.getAllActive(); }

    @GetMapping("/{id}")
    public ProductEntity getById(@PathVariable int id) { return productService.getById(id); }

    @GetMapping("/categories")
    public List<ProductCategoryEntity> getCategories() { return categoryRepository.findByActiveTrue(); }

    @GetMapping("/category/{slug}")
    public List<ProductEntity> getByCategory(@PathVariable String slug) { return productService.getByCategory(slug); }

    @GetMapping("/{id}/variants")
    public List<ProductVariantEntity> getVariants(@PathVariable int id) { return productService.getVariants(id); }
}
""",
    "CartController.java": """
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

    @GetMapping("/")
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

    @DeleteMapping("/")
    public void clearCart(Authentication auth) {
        cartService.clearCart(getUser(auth).getId());
    }
}
""",
    "ShopOrderController.java": """
package mariano.projects.appVillaSanMartin.controllers;
import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.services.*;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shop/orders")
public class ShopOrderController {
    private final ShopOrderService orderService;
    private final ShopPaymentService paymentService;
    private final UserRepository userRepository;

    public ShopOrderController(ShopOrderService orderService, ShopPaymentService paymentService, UserRepository userRepository) {
        this.orderService = orderService;
        this.paymentService = paymentService;
        this.userRepository = userRepository;
    }

    private UserEntity getUser(Authentication auth) {
        UserDetails details = (UserDetails) auth.getPrincipal();
        return userRepository.findByEmail(details.getUsername()).orElseThrow();
    }

    @PostMapping("/")
    public ShopOrderEntity createOrder(@RequestBody(required = false) Map<String, String> body, Authentication auth) {
        String couponCode = body != null ? body.get("couponCode") : null;
        return orderService.createOrder(getUser(auth).getId(), couponCode);
    }

    @GetMapping("/my")
    public List<ShopOrderEntity> getMyOrders(Authentication auth) {
        return orderService.getMyOrders(getUser(auth).getId());
    }

    @GetMapping("/{id}")
    public ShopOrderEntity getOrderById(@PathVariable int id, Authentication auth) {
        return orderService.getOrderById(id, getUser(auth).getId());
    }

    @PostMapping("/{id}/pay")
    public Map<String, String> payOrder(@PathVariable int id, Authentication auth) throws Exception {
        ShopOrderEntity order = orderService.getOrderById(id, getUser(auth).getId());
        String initPoint = paymentService.createPreference((long) id);
        return Map.of("initPoint", initPoint);
    }
}
""",
    "CouponController.java": """
package mariano.projects.appVillaSanMartin.controllers;
import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.services.*;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {
    private final CouponService couponService;

    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    @PostMapping("/validate")
    public CouponEntity validate(@RequestBody Map<String, Object> body) {
        String code = (String) body.get("code");
        BigDecimal amount = new BigDecimal(body.get("amount").toString());
        return couponService.validate(code, amount);
    }
}
""",
    "FavoriteProductController.java": """
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

    @GetMapping("/")
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
""",
    "NewsController.java": """
package mariano.projects.appVillaSanMartin.controllers;
import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.services.*;
import mariano.projects.appVillaSanMartin.repositories.NewsCategoryRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/news")
public class NewsController {
    private final NewsService newsService;
    private final NewsCategoryRepository catRepo;

    public NewsController(NewsService newsService, NewsCategoryRepository catRepo) {
        this.newsService = newsService;
        this.catRepo = catRepo;
    }

    @GetMapping("/")
    public List<NewsEntity> getAll() { return newsService.getAll(); }

    @GetMapping("/featured")
    public List<NewsEntity> getFeatured() { return newsService.getFeatured(); }

    @GetMapping("/{id}")
    public NewsEntity getById(@PathVariable int id) { return newsService.getById(id); }

    @GetMapping("/category/{slug}")
    public List<NewsEntity> getByCategory(@PathVariable String slug) { return newsService.getByCategory(slug); }

    @GetMapping("/search")
    public List<NewsEntity> search(@RequestParam String q) { return newsService.search(q); }

    @GetMapping("/{id}/related")
    public List<NewsEntity> getRelated(@PathVariable int id) { return newsService.getRelated(id); }

    @GetMapping("/categories")
    public List<NewsCategoryEntity> getCategories() { return catRepo.findAll(); }
}
""",
    "FavoriteNewsController.java": """
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

    @GetMapping("/")
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
""",
    "GalleryController.java": """
package mariano.projects.appVillaSanMartin.controllers;
import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.services.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/galleries")
public class GalleryController {
    private final GalleryService galleryService;

    public GalleryController(GalleryService galleryService) {
        this.galleryService = galleryService;
    }

    @GetMapping("/")
    public List<GalleryEntity> getAll() { return galleryService.getAll(); }

    @GetMapping("/{id}")
    public GalleryEntity getById(@PathVariable int id) { return galleryService.getById(id); }

    @GetMapping("/{id}/photos")
    public List<PhotoEntity> getPhotos(@PathVariable int id) { return galleryService.getPhotos(id); }
}
""",
    "VideoController.java": """
package mariano.projects.appVillaSanMartin.controllers;
import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.services.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/videos")
public class VideoController {
    private final VideoService videoService;

    public VideoController(VideoService videoService) {
        this.videoService = videoService;
    }

    @GetMapping("/")
    public List<VideoEntity> getAll() { return videoService.getAll(); }

    @GetMapping("/{id}")
    public VideoEntity getById(@PathVariable int id) { return videoService.getById(id); }

    @GetMapping("/type/{type}")
    public List<VideoEntity> getByType(@PathVariable String type) { return videoService.getByType(type); }
}
""",
    "CantinaController.java": """
package mariano.projects.appVillaSanMartin.controllers;
import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.services.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cantina")
public class CantinaController {
    private final CantinaService cantinaService;

    public CantinaController(CantinaService cantinaService) {
        this.cantinaService = cantinaService;
    }

    @GetMapping("/info")
    public CantinaInfoEntity getInfo() { return cantinaService.getInfo(); }

    @GetMapping("/menu")
    public List<CantinaMenuItemEntity> getMenu() { return cantinaService.getMenu(); }

    @GetMapping("/menu/categories")
    public Map<String, List<CantinaMenuItemEntity>> getMenuByCategory() { return cantinaService.getMenuByCategory(); }

    @GetMapping("/categories")
    public List<CantinaMenuCategoryEntity> getCategories() { return cantinaService.getCategories(); }

    @PatchMapping("/info/status")
    public void updateStatus(@RequestBody Map<String, Boolean> body) {
        cantinaService.updateOpenStatus(body.get("isOpen"));
    }
}
""",
    "CantinaOrderController.java": """
package mariano.projects.appVillaSanMartin.controllers;
import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.services.*;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cantina/orders")
public class CantinaOrderController {
    private final CantinaOrderService orderService;
    private final UserRepository userRepository;

    public CantinaOrderController(CantinaOrderService orderService, UserRepository userRepository) {
        this.orderService = orderService;
        this.userRepository = userRepository;
    }

    private UserEntity getUser(Authentication auth) {
        if (auth == null) return null;
        Object principal = auth.getPrincipal();
        if (principal instanceof UserDetails) {
            UserDetails details = (UserDetails) principal;
            return userRepository.findByEmail(details.getUsername()).orElse(null);
        }
        return null;
    }

    @PostMapping("/")
    public CantinaOrderEntity createOrder(@RequestBody Map<String, Object> body, Authentication auth) {
        List<Map<String, Integer>> itemsList = (List<Map<String, Integer>>) body.get("items");
        List<CantinaOrderService.OrderItemRequest> reqs = itemsList.stream().map(m -> {
            CantinaOrderService.OrderItemRequest req = new CantinaOrderService.OrderItemRequest();
            req.menuItemId = m.get("menuItemId");
            req.quantity = m.get("quantity");
            return req;
        }).toList();
        String paymentMethod = (String) body.get("paymentMethod");
        String notes = (String) body.get("notes");
        UserEntity u = getUser(auth);
        Integer userId = u != null ? u.getId() : null;
        return orderService.createOrder(userId, reqs, paymentMethod, notes);
    }

    @GetMapping("/track/{orderNumber}")
    public CantinaOrderEntity trackOrder(@PathVariable String orderNumber) {
        return orderService.getByOrderNumber(orderNumber);
    }

    @GetMapping("/my")
    public List<CantinaOrderEntity> getMyOrders(Authentication auth) {
        UserEntity u = getUser(auth);
        if (u == null) return List.of();
        return orderService.getMyOrders(u.getId());
    }

    @PatchMapping("/{orderNumber}/status")
    public void updateStatus(@PathVariable String orderNumber, @RequestBody Map<String, String> body) {
        orderService.updateStatus(orderNumber, body.get("status"));
    }
}
"""
}

for filename, content in controllers.items():
    create_file(f"{controllers_dir}/{filename}", content)

print("Controllers generated.")
