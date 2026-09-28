package mariano.projects.appVillaSanMartin.models.requests;

import lombok.Data;

@Data
public class StandingRequest {
    private String teamName;
    private Integer teamId;
    private Integer season;
    private String zone;
    private Integer played;
    private Integer wins;
    private Integer losses;
    private Integer pointsFor;
    private Integer pointsAgainst;
    private String streak;
    private Integer position;
}
