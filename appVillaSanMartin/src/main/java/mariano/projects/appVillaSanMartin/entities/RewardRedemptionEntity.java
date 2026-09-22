package mariano.projects.appVillaSanMartin.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "reward_redemptions")
@Data
public class RewardRedemptionEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;
    @ManyToOne @JoinColumn(name = "reward_id", nullable = false)
    private RewardEntity reward;
    @Column(nullable = false, unique = true, length = 50)
    private String code;
    @Column(name = "redeemed_at")
    private LocalDateTime redeemedAt;
    @Column(name = "used_at")
    private LocalDateTime usedAt;
    @Column(name = "expires_at")
    private LocalDateTime expiresAt;
}
