package mariano.projects.appVillaSanMartin.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;

@Entity(name = "PlayByPlay")
@Table(name = "play_by_play")
@Data
public class PlayByPlayEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "match_id", nullable = false)
    private MatchEntity match;

    @Column(nullable = false)
    private Integer quarter;

    @Column(nullable = false, length = 10)
    private String clock;

    @Column(name = "event_type", nullable = false, length = 30)
    private String eventType;

    @ManyToOne
    @JoinColumn(name = "player_id")
    private PlayerEntity player;

    @Column(name = "team_is_local")
    private Boolean teamIsLocal;

    @Column(name = "home_score", nullable = false)
    private Integer homeScore = 0;

    @Column(name = "away_score", nullable = false)
    private Integer awayScore = 0;

    @Column(nullable = false, length = 300)
    private String description;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    private void setCreatedAt() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
