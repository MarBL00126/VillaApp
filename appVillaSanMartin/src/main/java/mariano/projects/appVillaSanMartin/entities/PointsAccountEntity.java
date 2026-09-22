package mariano.projects.appVillaSanMartin.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "points_accounts")
@Data
public class PointsAccountEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @OneToOne @JoinColumn(name = "user_id", nullable = false, unique = true)
    private UserEntity user;
    @Column(name = "total_points", nullable = false)
    private Integer totalPoints = 0;
    @Column(nullable = false, length = 30)
    private String level = "ROOKIE";
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
