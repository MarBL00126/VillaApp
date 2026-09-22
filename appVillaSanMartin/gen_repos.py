import os

base_pkg = "mariano.projects.appVillaSanMartin"
base_dir = "src/main/java/mariano/projects/appVillaSanMartin"

def create_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")

repos_dir = f"{base_dir}/repositories"

repos = {
    "ProductCategoryRepository.java": """
package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.ProductCategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategoryEntity, Integer> {
    Optional<ProductCategoryEntity> findBySlug(String slug);
    List<ProductCategoryEntity> findByActiveTrue();
}
""",
    "ProductRepository.java": """
package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface ProductRepository extends JpaRepository<ProductEntity, Integer> {
    List<ProductEntity> findByCategoryIdAndActiveTrue(Integer categoryId);
    List<ProductEntity> findByActiveTrue();
}
""",
    "ProductVariantRepository.java": """
package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.ProductVariantEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariantEntity, Integer> {
    List<ProductVariantEntity> findByProductId(Integer productId);
}
""",
    "CartRepository.java": """
package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.CartEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface CartRepository extends JpaRepository<CartEntity, Integer> {
    Optional<CartEntity> findByUserId(Integer userId);
}
""",
    "CartItemRepository.java": """
package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.CartItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
@Repository
public interface CartItemRepository extends JpaRepository<CartItemEntity, Integer> {
    List<CartItemEntity> findByCartId(Integer cartId);
    Optional<CartItemEntity> findByCartIdAndProductIdAndVariantId(Integer cartId, Integer productId, Integer variantId);
}
""",
    "CouponRepository.java": """
package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.CouponEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface CouponRepository extends JpaRepository<CouponEntity, Integer> {
    Optional<CouponEntity> findByCode(String code);
}
""",
    "ShopOrderRepository.java": """
package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.ShopOrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface ShopOrderRepository extends JpaRepository<ShopOrderEntity, Integer> {
    List<ShopOrderEntity> findByUserIdOrderByCreatedAtDesc(Integer userId);
}
""",
    "ShopOrderItemRepository.java": """
package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.ShopOrderItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface ShopOrderItemRepository extends JpaRepository<ShopOrderItemEntity, Integer> {
    List<ShopOrderItemEntity> findByOrderId(Integer orderId);
}
""",
    "FavoriteProductRepository.java": """
package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.FavoriteProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
@Repository
public interface FavoriteProductRepository extends JpaRepository<FavoriteProductEntity, Integer> {
    List<FavoriteProductEntity> findByUserId(Integer userId);
    Optional<FavoriteProductEntity> findByUserIdAndProductId(Integer userId, Integer productId);
    boolean existsByUserIdAndProductId(Integer userId, Integer productId);
}
""",
    "NewsCategoryRepository.java": """
package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.NewsCategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface NewsCategoryRepository extends JpaRepository<NewsCategoryEntity, Integer> {
    Optional<NewsCategoryEntity> findBySlug(String slug);
}
""",
    "NewsRepository.java": """
package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.NewsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface NewsRepository extends JpaRepository<NewsEntity, Integer> {
    List<NewsEntity> findByFeaturedTrueOrderByPublishedAtDesc();
    List<NewsEntity> findByCategoryIdOrderByPublishedAtDesc(Integer categoryId);
    List<NewsEntity> findByTitleContainingIgnoreCaseOrSummaryContainingIgnoreCase(String title, String summary);
}
""",
    "FavoriteNewsRepository.java": """
package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.FavoriteNewsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface FavoriteNewsRepository extends JpaRepository<FavoriteNewsEntity, Integer> {
    List<FavoriteNewsEntity> findByUserId(Integer userId);
    boolean existsByUserIdAndNewsId(Integer userId, Integer newsId);
}
""",
    "GalleryRepository.java": """
package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.GalleryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface GalleryRepository extends JpaRepository<GalleryEntity, Integer> {
    List<GalleryEntity> findAllByOrderByEventDateDesc();
}
""",
    "PhotoRepository.java": """
package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.PhotoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface PhotoRepository extends JpaRepository<PhotoEntity, Integer> {
    List<PhotoEntity> findByGalleryIdOrderBySortOrder(Integer galleryId);
}
""",
    "VideoRepository.java": """
package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.VideoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface VideoRepository extends JpaRepository<VideoEntity, Integer> {
    List<VideoEntity> findByTypeOrderByPublishedAtDesc(String type);
    List<VideoEntity> findAllByOrderByPublishedAtDesc();
}
""",
    "CantinaInfoRepository.java": """
package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.CantinaInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface CantinaInfoRepository extends JpaRepository<CantinaInfoEntity, Integer> {
}
""",
    "CantinaMenuCategoryRepository.java": """
package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.CantinaMenuCategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface CantinaMenuCategoryRepository extends JpaRepository<CantinaMenuCategoryEntity, Integer> {
    List<CantinaMenuCategoryEntity> findAllByOrderBySortOrder();
}
""",
    "CantinaMenuItemRepository.java": """
package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.CantinaMenuItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface CantinaMenuItemRepository extends JpaRepository<CantinaMenuItemEntity, Integer> {
    List<CantinaMenuItemEntity> findByCategoryIdAndAvailableTrue(Integer categoryId);
    List<CantinaMenuItemEntity> findByAvailableTrue();
}
""",
    "CantinaOrderRepository.java": """
package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.CantinaOrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
@Repository
public interface CantinaOrderRepository extends JpaRepository<CantinaOrderEntity, Integer> {
    Optional<CantinaOrderEntity> findByOrderNumber(String orderNumber);
    List<CantinaOrderEntity> findByUserIdOrderByCreatedAtDesc(Integer userId);
    List<CantinaOrderEntity> findByStatus(String status);
}
""",
    "CantinaOrderItemRepository.java": """
package mariano.projects.appVillaSanMartin.repositories;
import mariano.projects.appVillaSanMartin.entities.CantinaOrderItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface CantinaOrderItemRepository extends JpaRepository<CantinaOrderItemEntity, Integer> {
    List<CantinaOrderItemEntity> findByOrderId(Integer orderId);
}
"""
}

for filename, content in repos.items():
    create_file(f"{repos_dir}/{filename}", content)

print("Repositories generated.")
