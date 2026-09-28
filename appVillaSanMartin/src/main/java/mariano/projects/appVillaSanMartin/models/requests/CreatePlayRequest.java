package mariano.projects.appVillaSanMartin.models.requests;

import lombok.Data;

@Data
public class CreatePlayRequest {
    private Integer quarter;
    private String clock;
    private String eventType;
    private Integer playerId;
    private Boolean teamIsLocal;
    private Integer homeScore;
    private Integer awayScore;
    private String description;
}
