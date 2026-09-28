package mariano.projects.appVillaSanMartin.models.responses;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccessScanResponse {
    private boolean ok;
    private String status;
    private String message;
    private String name;
    private String sector;
    private String gate;
}
