package mariano.projects.appVillaSanMartin.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
@Entity(name="AccessLog")
@Table(name="access_logs")
@Data 
public class AccessLogEntity {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ticket_id")
    private Integer ticketId;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "match_id")
    private Integer matchId;

    @Column(name = "scanned_at")
    private LocalDateTime scannedAt;

    @Column(length = 20)
    private String gate;

    @Column(nullable = false, length = 20)
    private String status = "OK";

    @Column(name = "device_id", length = 100)
    private String deviceId;

    @Column(length = 300)
    private String notes;
}
