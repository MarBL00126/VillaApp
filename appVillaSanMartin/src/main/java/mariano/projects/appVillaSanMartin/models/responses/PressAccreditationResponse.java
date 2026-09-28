package mariano.projects.appVillaSanMartin.models.responses;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PressAccreditationResponse {
    private Integer id;
    private Integer matchId;
    private String journalistName;
    private String mediaName;
    private String role;
    private String email;
    private String phone;
    private String coverageType;
    private String status;
    private String notes;
    private String qrCode;
    private Integer sectorId;
    private String gate;
    private LocalDateTime validFrom;
    private LocalDateTime validUntil;
    private LocalDateTime submittedAt;
}
