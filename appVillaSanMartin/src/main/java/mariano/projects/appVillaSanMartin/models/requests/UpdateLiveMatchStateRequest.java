package mariano.projects.appVillaSanMartin.models.requests;

import lombok.Data;

@Data
public class UpdateLiveMatchStateRequest {
    private String status;
    private Integer quarter;
    private String clock;
    private Integer homeScore;
    private Integer awayScore;
}
