package mariano.projects.appVillaSanMartin.models.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StandingResponse {
    private Integer id;
    private String teamName;
    private Integer teamId;
    private Integer season;
    private String zone;
    private Integer played;
    private Integer wins;
    private Integer losses;
    private Integer pointsFor;
    private Integer pointsAgainst;
    private Integer pointDifference;
    private String streak;
    private Integer position;
}
