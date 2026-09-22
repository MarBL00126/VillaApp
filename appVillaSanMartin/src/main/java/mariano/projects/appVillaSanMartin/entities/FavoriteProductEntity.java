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
