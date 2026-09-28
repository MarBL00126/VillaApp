package mariano.projects.appVillaSanMartin.models.responses;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayByPlayResponse {
    private Integer id;
    private Integer matchId;
    private Integer quarter;
    private String clock;
    private String eventType;
    private Integer playerId;
    private String playerName;
    private Boolean teamIsLocal;
    private Integer homeScore;
    private Integer awayScore;
    private String description;
    private LocalDateTime createdAt;
}
