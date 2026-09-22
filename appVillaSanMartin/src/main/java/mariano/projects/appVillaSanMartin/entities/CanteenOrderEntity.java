package mariano.projects.appVillaSanMartin.entities;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
@Entity(name="CanteenOrder")
@Table(name="canteen_orders")
@Data
public class CanteenOrderEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne @JoinColumn(name="user_id", nullable=true)
    private UserEntity user;
    private String orderNumber;
    private String status;
    private BigDecimal totalAmount;
    private String paymentMethod;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime readyAt;
    
    @OneToMany(mappedBy="order", cascade=CascadeType.ALL)
    private List<CanteenOrderItemEntity> items;
}
