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
