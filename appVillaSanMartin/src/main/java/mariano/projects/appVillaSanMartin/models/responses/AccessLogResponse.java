package mariano.projects.appVillaSanMartin.models.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccessLogResponse {
    private Integer id;
    private Integer ticketId;
    private Integer userId;
    private Integer matchId;
    private LocalDateTime scannedAt;
    private String gate;
    private String status;
    private String deviceId;
    private String notes;
}
