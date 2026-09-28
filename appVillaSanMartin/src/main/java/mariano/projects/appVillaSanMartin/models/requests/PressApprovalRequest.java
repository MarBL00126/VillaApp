package mariano.projects.appVillaSanMartin.models.requests;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class PressApprovalRequest {
    private Integer sectorId;
    private String gate;
    private LocalDateTime validFrom;
    private LocalDateTime validUntil;
}
