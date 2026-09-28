package mariano.projects.appVillaSanMartin.models.requests;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class UpdateBoxScoreRequest {
    private Boolean teamIsLocal;
    private BigDecimal minutes;
    private Integer fgMade;
    private Integer fgAtt;
    private Integer threeMade;
    private Integer threeAtt;
    private Integer ftMade;
    private Integer ftAtt;
    private Integer points;
    private Integer rebounds;
    private Integer offRebounds;
    private Integer defRebounds;
    private Integer assists;
    private Integer steals;
    private Integer blocks;
    private Integer turnovers;
    private Integer fouls;
    private Integer plusMinus;
}
