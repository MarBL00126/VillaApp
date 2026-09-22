package mariano.projects.appVillaSanMartin.entities;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
@Entity(name="Video")
@Table(name="videos")
@Data
public class VideoEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    private String title;
    private String description;
    private String url;
    private String thumbnail;
    private String type;
    private LocalDateTime publishedAt;
}
