package mariano.projects.appVillaSanMartin.entities;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
@Entity(name="News")
@Table(name="news")
@Data
public class NewsEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne @JoinColumn(name="category_id")
    private NewsCategoryEntity category;
    private String title;
    private String summary;
    private String content;
    private String imageUrl;
    private Boolean featured;
    private String author;
    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
}
