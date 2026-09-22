package mariano.projects.appVillaSanMartin.entities;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
@Entity(name="Gallery")
@Table(name="galleries")
@Data
public class GalleryEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    private String title;
    private String coverImageUrl;
    private LocalDate eventDate;
    private LocalDateTime createdAt;
}
