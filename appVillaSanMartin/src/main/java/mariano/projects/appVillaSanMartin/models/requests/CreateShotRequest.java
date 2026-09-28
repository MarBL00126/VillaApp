package mariano.projects.appVillaSanMartin.models.requests;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class CreateShotRequest {
    private Integer playerId;
    private Integer quarter;
    private String clock;
    private BigDecimal x;
    private BigDecimal y;
    private Boolean made;
    private String shotType;
}
