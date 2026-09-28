package mariano.projects.appVillaSanMartin.models.responses;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShotChartResponse {
    private Integer id;
    private Integer matchId;
    private Integer playerId;
    private String playerName;
    private Integer quarter;
    private String clock;
    private BigDecimal x;
    private BigDecimal y;
    private Boolean made;
    private String shotType;
    private LocalDateTime createdAt;
}
