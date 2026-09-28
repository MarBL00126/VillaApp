package mariano.projects.appVillaSanMartin.models.responses;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LiveMatchStateResponse {
    private Integer id;
    private Integer matchId;
    private String status;
    private Integer quarter;
    private String clock;
    private Integer homeScore;
    private Integer awayScore;
    private LocalDateTime lastUpdated;
}
