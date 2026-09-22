package mariano.projects.appVillaSanMartin.entities;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
@Entity(name="CanteenOrderItem")
@Table(name="canteen_order_items")
@Data
public class CanteenOrderItemEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne @JoinColumn(name="order_id")
    private CanteenOrderEntity order;
    @ManyToOne @JoinColumn(name="menu_item_id")
    private CanteenMenuItemEntity menuItem;
    private Integer quantity;
    private BigDecimal unitPrice;
}
