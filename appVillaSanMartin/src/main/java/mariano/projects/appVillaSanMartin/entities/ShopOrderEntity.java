package mariano.projects.appVillaSanMartin.entities;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
@Entity(name="ShopOrder")
@Table(name="shop_orders")
@Data
public class ShopOrderEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne @JoinColumn(name="user_id")
    private UserEntity user;
    @ManyToOne @JoinColumn(name="coupon_id")
    private CouponEntity coupon;
    private BigDecimal subtotal;
    private BigDecimal discount;
    private BigDecimal totalAmount;
    private String status;
    private String mpPaymentId;
    private String mpPreferenceId;
    private LocalDateTime createdAt;
    private LocalDateTime paidAt;
    
    @OneToMany(mappedBy="order", cascade=CascadeType.ALL)
    private List<ShopOrderItemEntity> items;
}
