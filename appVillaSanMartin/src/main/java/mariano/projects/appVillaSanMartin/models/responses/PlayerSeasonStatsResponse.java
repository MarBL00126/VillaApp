package mariano.projects.appVillaSanMartin.models.responses;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayerSeasonStatsResponse {
    private Integer playerId;
    private String playerName;
    private Integer season;
    private Integer playedGames;
    private BigDecimal minutes;
    private BigDecimal points;
    private BigDecimal rebounds;
    private BigDecimal assists;
    private BigDecimal steals;
    private BigDecimal blocks;
    private BigDecimal turnovers;
    private BigDecimal fouls;
    private BigDecimal pointsAverage;
    private BigDecimal reboundsAverage;
    private BigDecimal assistsAverage;
}
