import os

base_pkg = "mariano.projects.appVillaSanMartin"
base_dir = "src/main/java/mariano/projects/appVillaSanMartin"

def create_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")

entities_dir = f"{base_dir}/entities"

entities = {
    "ProductCategoryEntity.java": """
package mariano.projects.appVillaSanMartin.entities;
import jakarta.persistence.*;
import lombok.Data;
@Entity(name="ProductCategory")
@Table(name="product_categories")
@Data
public class ProductCategoryEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private String slug;
    private Boolean active;
}
""",
    "ProductEntity.java": """
package mariano.projects.appVillaSanMartin.entities;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
@Entity(name="Product")
@Table(name="products")
@Data
public class ProductEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne @JoinColumn(name="category_id")
    private ProductCategoryEntity category;
    private String name;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private Boolean active;
    private LocalDateTime createdAt;
}
""",
    "ProductVariantEntity.java": """
package mariano.projects.appVillaSanMartin.entities;
import jakarta.persistence.*;
import lombok.Data;
@Entity(name="ProductVariant")
@Table(name="product_variants")
@Data
public class ProductVariantEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne @JoinColumn(name="product_id")
    private ProductEntity product;
    private String label;
    private Integer stock;
}
""",
    "CartEntity.java": """
package mariano.projects.appVillaSanMartin.entities;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
@Entity(name="Cart")
@Table(name="carts")
@Data
public class CartEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne @JoinColumn(name="user_id", unique=true)
    private UserEntity user;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy="cart", cascade=CascadeType.ALL, orphanRemoval=true)
    private List<CartItemEntity> items;
}
""",
    "CartItemEntity.java": """
package mariano.projects.appVillaSanMartin.entities;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
@Entity(name="CartItem")
@Table(name="cart_items")
@Data
public class CartItemEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne @JoinColumn(name="cart_id")
    private CartEntity cart;
    @ManyToOne @JoinColumn(name="product_id")
    private ProductEntity product;
    @ManyToOne @JoinColumn(name="variant_id")
    private ProductVariantEntity variant;
    private Integer quantity;
    private BigDecimal unitPrice;
}
""",
    "CouponEntity.java": """
package mariano.projects.appVillaSanMartin.entities;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
@Entity(name="Coupon")
@Table(name="coupons")
@Data
public class CouponEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    private String code;
    private BigDecimal discountPct;
    private BigDecimal minAmount;
    private LocalDateTime expiresAt;
    private Boolean active;
    private Integer maxUses;
    private Integer usedCount;
}
""",
    "ShopOrderEntity.java": """
package mariano.projects.appVillaSanMartin.entities;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
@Entity(name="ShopOrder")
@Table(name="shop_orders")
@Data
public class ShopOrderEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne @JoinColumn(name="user_id")
    private UserEntity user;
    @ManyToOne @JoinColumn(name="coupon_id")
    private CouponEntity coupon;
    private BigDecimal subtotal;
    private BigDecimal discount;
    private BigDecimal totalAmount;
    private String status;
    private String mpPaymentId;
    private String mpPreferenceId;
    private LocalDateTime createdAt;
    private LocalDateTime paidAt;
    
    @OneToMany(mappedBy="order", cascade=CascadeType.ALL)
    private List<ShopOrderItemEntity> items;
}
""",
    "ShopOrderItemEntity.java": """
package mariano.projects.appVillaSanMartin.entities;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
@Entity(name="ShopOrderItem")
@Table(name="shop_order_items")
@Data
public class ShopOrderItemEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne @JoinColumn(name="order_id")
    private ShopOrderEntity order;
    @ManyToOne @JoinColumn(name="product_id")
    private ProductEntity product;
    @ManyToOne @JoinColumn(name="variant_id")
    private ProductVariantEntity variant;
    private Integer quantity;
    private BigDecimal unitPrice;
}
""",
    "FavoriteProductEntity.java": """
package mariano.projects.appVillaSanMartin.entities;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
@Entity(name="FavoriteProduct")
@Table(name="favorite_products")
@Data
public class FavoriteProductEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne @JoinColumn(name="user_id")
    private UserEntity user;
    @ManyToOne @JoinColumn(name="product_id")
    private ProductEntity product;
    private LocalDateTime createdAt;
}
""",
    "NewsCategoryEntity.java": """
package mariano.projects.appVillaSanMartin.entities;
import jakarta.persistence.*;
import lombok.Data;
@Entity(name="NewsCategory")
@Table(name="news_categories")
@Data
public class NewsCategoryEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private String slug;
}
""",
    "NewsEntity.java": """
package mariano.projects.appVillaSanMartin.entities;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
@Entity(name="News")
@Table(name="news")
@Data
public class NewsEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne @JoinColumn(name="category_id")
    private NewsCategoryEntity category;
    private String title;
    private String summary;
    private String content;
    private String imageUrl;
    private Boolean featured;
    private String author;
    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
}
""",
    "FavoriteNewsEntity.java": """
package mariano.projects.appVillaSanMartin.entities;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
@Entity(name="FavoriteNews")
@Table(name="favorite_news")
@Data
public class FavoriteNewsEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne @JoinColumn(name="user_id")
    private UserEntity user;
    @ManyToOne @JoinColumn(name="news_id")
    private NewsEntity news;
    private LocalDateTime createdAt;
}
""",
    "GalleryEntity.java": """
package mariano.projects.appVillaSanMartin.entities;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
@Entity(name="Gallery")
@Table(name="galleries")
@Data
public class GalleryEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    private String title;
    private String coverImageUrl;
    private LocalDate eventDate;
    private LocalDateTime createdAt;
}
""",
    "PhotoEntity.java": """
package mariano.projects.appVillaSanMartin.entities;
import jakarta.persistence.*;
import lombok.Data;
@Entity(name="Photo")
@Table(name="photos")
@Data
public class PhotoEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne @JoinColumn(name="gallery_id")
    private GalleryEntity gallery;
    private String imageUrl;
    private String caption;
    private Integer sortOrder;
}
""",
    "VideoEntity.java": """
package mariano.projects.appVillaSanMartin.entities;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
@Entity(name="Video")
@Table(name="videos")
@Data
public class VideoEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    private String title;
    private String description;
    private String url;
    private String thumbnail;
    private String type;
    private LocalDateTime publishedAt;
}
""",
    "CantinaInfoEntity.java": """
package mariano.projects.appVillaSanMartin.entities;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
@Entity(name="CantinaInfo")
@Table(name="cantina_info")
@Data
public class CantinaInfoEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    private String address;
    private String phone;
    private String email;
    private String schedule;
    private String paymentMethods;
    private String mapsUrl;
    private Boolean isOpen;
    private LocalDateTime updatedAt;
}
""",
    "CantinaMenuCategoryEntity.java": """
package mariano.projects.appVillaSanMartin.entities;
import jakarta.persistence.*;
import lombok.Data;
@Entity(name="CantinaMenuCategory")
@Table(name="cantina_menu_categories")
@Data
public class CantinaMenuCategoryEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private Integer sortOrder;
}
""",
    "CantinaMenuItemEntity.java": """
package mariano.projects.appVillaSanMartin.entities;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
@Entity(name="CantinaMenuItem")
@Table(name="cantina_menu_items")
@Data
public class CantinaMenuItemEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne @JoinColumn(name="category_id")
    private CantinaMenuCategoryEntity category;
    private String name;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private Boolean available;
}
""",
    "CantinaOrderEntity.java": """
package mariano.projects.appVillaSanMartin.entities;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
@Entity(name="CantinaOrder")
@Table(name="cantina_orders")
@Data
public class CantinaOrderEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne @JoinColumn(name="user_id", nullable=true)
    private UserEntity user;
    private String orderNumber;
    private String status;
    private BigDecimal totalAmount;
    private String paymentMethod;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime readyAt;
    
    @OneToMany(mappedBy="order", cascade=CascadeType.ALL)
    private List<CantinaOrderItemEntity> items;
}
""",
    "CantinaOrderItemEntity.java": """
package mariano.projects.appVillaSanMartin.entities;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
@Entity(name="CantinaOrderItem")
@Table(name="cantina_order_items")
@Data
public class CantinaOrderItemEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne @JoinColumn(name="order_id")
    private CantinaOrderEntity order;
    @ManyToOne @JoinColumn(name="menu_item_id")
    private CantinaMenuItemEntity menuItem;
    private Integer quantity;
    private BigDecimal unitPrice;
}
"""
}

for filename, content in entities.items():
    create_file(f"{entities_dir}/{filename}", content)

print("Entities generated.")
