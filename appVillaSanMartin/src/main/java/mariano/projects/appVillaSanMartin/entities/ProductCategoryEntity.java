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
