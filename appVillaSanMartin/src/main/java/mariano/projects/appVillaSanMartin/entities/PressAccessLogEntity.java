package mariano.projects.appVillaSanMartin.entities;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
@Entity(name="PressAccessLog")
@Table(name="press_access_logs")
@Data 
public class PressAccessLogEntity {
     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "accreditation_id", nullable = false)
    private Integer accreditationId;

    @Column(name = "scanned_at")
    private LocalDateTime scannedAt;

    @Column(nullable = false, length = 10)
    private String direction = "IN";

    @Column(length = 20)
    private String gate;

    @Column(name = "device_id", length = 100)
    private String deviceId;
}
