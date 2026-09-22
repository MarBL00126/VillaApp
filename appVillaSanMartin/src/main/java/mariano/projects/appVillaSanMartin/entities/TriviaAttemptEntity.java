package mariano.projects.appVillaSanMartin.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "trivia_attempts")
@Data
public class TriviaAttemptEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;
    @ManyToOne @JoinColumn(name = "trivia_id", nullable = false)
    private TriviaEntity trivia;
    @Column(nullable = false)
    private Integer score = 0;
    @Column(name = "points_awarded")
    private Integer pointsAwarded;
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
}
