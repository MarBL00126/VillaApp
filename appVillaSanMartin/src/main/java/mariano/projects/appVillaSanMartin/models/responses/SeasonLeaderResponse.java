package mariano.projects.appVillaSanMartin.models.responses;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeasonLeaderResponse {
    private Integer playerId;
    private String playerName;
    private Integer season;
    private String category;
    private BigDecimal total;
    private BigDecimal average;
    private Integer playedGames;
}
