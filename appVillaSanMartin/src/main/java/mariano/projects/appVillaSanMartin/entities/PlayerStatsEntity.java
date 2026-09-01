package mariano.projects.appVillaSanMartin.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity(name = "PlayerStats")
@Table(name = "players_stats")
@Data
public class PlayerStatsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @OneToOne
    @JoinColumn(name = "player_id", nullable = false, unique = true)
    private PlayerEntity player;
    @Column(name = "played_games")
    private float playedGames;
    @Column(name = "total_minutes")
    private float totalMinutes;
    @Column(name = "total_points")
    private float totalPoints;
    @Column(name = "made_free_throws")
    private float madeFreeThrows;
    @Column(name = "attempted_free_throws")
    private float attemptedFreeThrows;
    @Column(name = "made_two_pointers")
    private float madeTwoPointers;
    @Column(name = "attempted_two_pointers")
    private float attemptedTwoPointers;
    @Column(name = "made_three_pointers")
    private float madeThreePointers;
    @Column(name = "attempted_three_pointers")
    private float attemptedThreePointers;
    @Column(name = "total_rebounds")
    private float totalRebounds;
    @Column(name = "total_assists")
    private float totalAssists;
    @Column(name = "total_blocks")
    private float totalBlocks;
    @Column(name = "total_turnovers")
    private float totalTurnovers;
    @Column(name = "total_steals")
    private float totalSteals;
    @Column(name = "total_fouls")
    private float totalFouls;
    @Column(name = "total_valoration")
    private float totalValoration;

}
