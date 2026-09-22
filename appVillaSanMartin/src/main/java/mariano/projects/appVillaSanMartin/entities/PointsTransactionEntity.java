package mariano.projects.appVillaSanMartin.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "points_transactions")
@Data
public class PointsTransactionEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne @JoinColumn(name = "account_id", nullable = false)
    private PointsAccountEntity account;
    @Column(nullable = false)
    private Integer amount;
    @Column(nullable = false, length = 50)
    private String reason;
    @Column(name = "reference_id")
    private Integer referenceId;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
