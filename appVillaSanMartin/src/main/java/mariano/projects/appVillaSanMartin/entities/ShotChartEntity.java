package mariano.projects.appVillaSanMartin.entities;

import java.math.BigDecimal;
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

@Entity(name = "ShotChart")
@Table(name = "shot_chart")
@Data
public class ShotChartEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "match_id", nullable = false)
    private MatchEntity match;

    @ManyToOne
    @JoinColumn(name = "player_id", nullable = false)
    private PlayerEntity player;

    @Column(nullable = false)
    private Integer quarter;

    @Column(length = 10)
    private String clock;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal x;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal y;

    @Column(nullable = false)
    private Boolean made;

    @Column(name = "shot_type", nullable = false, length = 20)
    private String shotType;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    private void setCreatedAt() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
