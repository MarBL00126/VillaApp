package mariano.projects.appVillaSanMartin.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;

@Entity(name = "Standings")
@Table(name = "standings", uniqueConstraints = @UniqueConstraint(columnNames = { "team_name", "season" }))
@Data
public class StandingsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "team_name", nullable = false, length = 100)
    private String teamName;

    @ManyToOne
    @JoinColumn(name = "team_id")
    private TeamEntity team;

    @Column(nullable = false)
    private Integer season;

    @Column(length = 50)
    private String zone;

    @Column(nullable = false)
    private Integer played = 0;

    @Column(nullable = false)
    private Integer wins = 0;

    @Column(nullable = false)
    private Integer losses = 0;

    @Column(name = "points_for", nullable = false)
    private Integer pointsFor = 0;

    @Column(name = "points_against", nullable = false)
    private Integer pointsAgainst = 0;

    @Column(length = 20)
    private String streak;

    @Column
    private Integer position;
}
