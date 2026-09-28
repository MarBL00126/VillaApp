package mariano.projects.appVillaSanMartin.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Data;

@Entity(name = "LiveMatchState")
@Table(name = "live_match_state")
@Data
public class LiveMatchStateEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "match_id", nullable = false, unique = true)
    private MatchEntity match;

    @Column(nullable = false, length = 20)
    private String status = "PRE";

    @Column(nullable = false)
    private Integer quarter = 1;

    @Column(nullable = false, length = 10)
    private String clock = "10:00";

    @Column(name = "home_score", nullable = false)
    private Integer homeScore = 0;

    @Column(name = "away_score", nullable = false)
    private Integer awayScore = 0;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    @PrePersist
    @PreUpdate
    private void touchLastUpdated() {
        lastUpdated = LocalDateTime.now();
    }
}
