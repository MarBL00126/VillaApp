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
