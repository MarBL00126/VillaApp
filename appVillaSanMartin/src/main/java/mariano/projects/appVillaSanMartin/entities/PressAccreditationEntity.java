package mariano.projects.appVillaSanMartin.entities;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
@Entity(name="PressAccreditation")
@Table(name="press_accreditations")
@Data 
public class PressAccreditationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "match_id")
    private Integer matchId;

    @Column(name = "journalist_name", nullable = false, length = 100)
    private String journalistName;

    @Column(name = "media_name", nullable = false, length = 200)
    private String mediaName;

    @Column(nullable = false, length = 100)
    private String role;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(length = 50)
    private String phone;

    @Column(name = "coverage_type", nullable = false, length = 50)
    private String coverageType;

    @Column(nullable = false, length = 20)
    private String status = "PENDING";

    @Column(length = 500)
    private String notes;

    @Column(name = "qr_code", unique = true, length = 200)
    private String qrCode;

    @Column(name = "sector_id")
    private Integer sectorId;

    @Column(length = 20)
    private String gate;

    @Column(name = "valid_from")
    private LocalDateTime validFrom;

    @Column(name = "valid_until")
    private LocalDateTime validUntil;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "reviewed_by")
    private Integer reviewedBy;
}
