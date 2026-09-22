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
