package mariano.projects.appVillaSanMartin.entities;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
@Entity(name="FavoriteNews")
@Table(name="favorite_news")
@Data
public class FavoriteNewsEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne @JoinColumn(name="user_id")
    private UserEntity user;
    @ManyToOne @JoinColumn(name="news_id")
    private NewsEntity news;
    private LocalDateTime createdAt;
}
