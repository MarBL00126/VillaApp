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
