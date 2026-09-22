package mariano.projects.appVillaSanMartin.entities;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
@Entity(name="Coupon")
@Table(name="coupons")
@Data
public class CouponEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    private String code;
    private BigDecimal discountPct;
    private BigDecimal minAmount;
    private LocalDateTime expiresAt;
    private Boolean active;
    private Integer maxUses;
    private Integer usedCount;
}
