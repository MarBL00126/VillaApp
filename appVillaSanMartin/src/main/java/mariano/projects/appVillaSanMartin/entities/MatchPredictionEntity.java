package mariano.projects.appVillaSanMartin.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "match_predictions")
@Data
public class MatchPredictionEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;
    @ManyToOne @JoinColumn(name = "match_id", nullable = false)
    private MatchEntity match;
    @Column(name = "predicted_home_score", nullable = false)
    private Integer predictedHomeScore;
    @Column(name = "predicted_away_score", nullable = false)
    private Integer predictedAwayScore;
    @Column(name = "points_awarded")
    private Integer pointsAwarded;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
