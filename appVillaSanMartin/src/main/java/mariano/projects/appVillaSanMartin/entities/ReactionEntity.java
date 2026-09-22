package mariano.projects.appVillaSanMartin.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "reactions")
@Data
public class ReactionEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;
    @Column(name = "target_type", nullable = false, length = 30)
    private String targetType;
    @Column(name = "target_id", nullable = false)
    private Integer targetId;
    @Column(nullable = false, length = 20)
    private String type;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
