package mariano.projects.appVillaSanMartin.entities;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
@Entity(name="Cart")
@Table(name="carts")
@Data
public class CartEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne @JoinColumn(name="user_id", unique=true)
    private UserEntity user;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy="cart", cascade=CascadeType.ALL, orphanRemoval=true)
    private List<CartItemEntity> items;
}
