package mariano.projects.appVillaSanMartin.models.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameLeadersResponse {
    private BoxScoreResponse topScorer;
    private BoxScoreResponse topRebounder;
    private BoxScoreResponse topAssistant;
    private BoxScoreResponse topStealer;
    private BoxScoreResponse topBlocker;
}
