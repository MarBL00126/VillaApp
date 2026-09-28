package mariano.projects.appVillaSanMartin.entities;

import java.math.BigDecimal;

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

@Entity(name = "BoxScore")
@Table(name = "box_score", uniqueConstraints = @UniqueConstraint(columnNames = { "match_id", "player_id" }))
@Data
public class BoxScoreEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "match_id", nullable = false)
    private MatchEntity match;

    @ManyToOne
    @JoinColumn(name = "player_id", nullable = false)
    private PlayerEntity player;

    @Column(name = "team_is_local", nullable = false)
    private Boolean teamIsLocal;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal minutes = BigDecimal.ZERO;

    @Column(name = "fg_made", nullable = false)
    private Integer fgMade = 0;

    @Column(name = "fg_att", nullable = false)
    private Integer fgAtt = 0;

    @Column(name = "three_made", nullable = false)
    private Integer threeMade = 0;

    @Column(name = "three_att", nullable = false)
    private Integer threeAtt = 0;

    @Column(name = "ft_made", nullable = false)
    private Integer ftMade = 0;

    @Column(name = "ft_att", nullable = false)
    private Integer ftAtt = 0;

    @Column(nullable = false)
    private Integer points = 0;

    @Column(nullable = false)
    private Integer rebounds = 0;

    @Column(name = "off_rebounds", nullable = false)
    private Integer offRebounds = 0;

    @Column(name = "def_rebounds", nullable = false)
    private Integer defRebounds = 0;

    @Column(nullable = false)
    private Integer assists = 0;

    @Column(nullable = false)
    private Integer steals = 0;

    @Column(nullable = false)
    private Integer blocks = 0;

    @Column(nullable = false)
    private Integer turnovers = 0;

    @Column(nullable = false)
    private Integer fouls = 0;

    @Column(name = "plus_minus", nullable = false)
    private Integer plusMinus = 0;
}
