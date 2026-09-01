package mariano.projects.appVillaSanMartin.models.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QrValidationResponse {
    private boolean valid;
    private String reason;
    private String sector;
    private String holder;
}
