package mariano.projects.appVillaSanMartin.models.responses;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayerMatchHistoryResponse {
    private Integer matchId;
    private LocalDateTime matchDate;
    private String opponent;
    private Boolean local;
    private BoxScoreResponse boxScore;
}
