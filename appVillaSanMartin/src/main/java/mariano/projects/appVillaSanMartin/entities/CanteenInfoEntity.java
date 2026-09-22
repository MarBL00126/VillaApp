package mariano.projects.appVillaSanMartin.entities;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
@Entity(name="CanteenInfo")
@Table(name="canteen_info")
@Data
public class CanteenInfoEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    private String address;
    private String phone;
    private String email;
    private String schedule;
    private String paymentMethods;
    private String mapsUrl;
    private Boolean isOpen;
    private LocalDateTime updatedAt;
}
