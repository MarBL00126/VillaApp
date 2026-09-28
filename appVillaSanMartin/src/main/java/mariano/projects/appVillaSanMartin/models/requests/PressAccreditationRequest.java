package mariano.projects.appVillaSanMartin.models.requests;
import lombok.Data;

@Data
public class PressAccreditationRequest {
    private Integer matchId;
    private String journalistName;
    private String mediaName;
    private String role;
    private String email;
    private String phone;
    private String coverageType;
}
