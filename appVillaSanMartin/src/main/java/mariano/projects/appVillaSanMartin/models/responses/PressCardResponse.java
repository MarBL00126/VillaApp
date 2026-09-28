package mariano.projects.appVillaSanMartin.models.responses;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PressCardResponse {
    private Integer id;
    private String journalistName;
    private String mediaName;
    private String role;
    private String qrCode;
    private String sector;
    private String gate;
    private LocalDateTime validUntil;
}
