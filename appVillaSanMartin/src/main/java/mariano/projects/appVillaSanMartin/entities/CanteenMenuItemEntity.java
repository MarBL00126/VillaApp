package mariano.projects.appVillaSanMartin.entities;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
@Entity(name="CanteenMenuItem")
@Table(name="canteen_menu_items")
@Data
public class CanteenMenuItemEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne @JoinColumn(name="category_id")
    private CanteenMenuCategoryEntity category;
    private String name;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private Boolean available;
}
