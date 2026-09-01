package mariano.projects.appVillaSanMartin.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity(name = "Match")
@Table(name = "matches")
@Data
public class MatchEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "match_date", nullable = false)
    private LocalDateTime matchDate;
    @Column(name = "is_local")
    private boolean isLocal;
    @Column(nullable = false, length = 100)
    private String opponent;
    @Column(name = "team_points")
    private int teamPoints;
    @Column(name = "opponent_points")
    private int opponentPoints;
    @ManyToOne
    @JoinColumn(name = "team_id", nullable = false)
    private TeamEntity team;

}
