package mariano.projects.appVillaSanMartin.entities;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
@Entity(name="UserPreferences")
@Table(name="user_preferences")
@Data
public class UserPreferencesEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    @OneToOne @JoinColumn(name="user_id", nullable=false, unique=true)
    private UserEntity user;
    @ManyToOne @JoinColumn(name="favorite_player_id")
    private PlayerEntity favoritePlayer;
    @Column(name="notify_news")
    private Boolean notifyNews = true;
    @Column(name="notify_videos")
    private Boolean notifyVideos = true;
    @Column(name="notify_fees")
    private Boolean notifyFees = true;
    @Column(name="notify_benefits")
    private Boolean notifyBenefits = true;
    @Column(name="notify_match_results")
    private Boolean notifyMatchResults = true;
    @Column(name="updated_at")
    private LocalDateTime updatedAt;

    public Integer getFavoritePlayerId() {
        return favoritePlayer != null ? favoritePlayer.getId() : null;
    }
}
