package mariano.projects.appVillaSanMartin.entities;
import jakarta.persistence.*;
import lombok.Data;
@Entity(name="CanteenMenuCategory")
@Table(name="canteen_menu_categories")
@Data
public class CanteenMenuCategoryEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private Integer sortOrder;
}
