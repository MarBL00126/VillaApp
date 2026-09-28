package mariano.projects.appVillaSanMartin.models.requests;
import lombok.Data;

@Data
public class AccessScanRequest {
    private String qrCode;
    private String gate;
    private Integer matchId;
    private String deviceId;
}
