package mariano.projects.appVillaSanMartin.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_badges")
@Data
public class UserBadgeEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;
    @ManyToOne @JoinColumn(name = "badge_id", nullable = false)
    private BadgeEntity badge;
    @Column(name = "earned_at")
    private LocalDateTime earnedAt;
}
