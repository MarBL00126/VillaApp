package mariano.projects.appVillaSanMartin.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
@Data
public class CommentEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;
    @Column(name = "target_type", nullable = false, length = 30)
    private String targetType;
    @Column(name = "target_id", nullable = false)
    private Integer targetId;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public String getAuthorName() {
        return user != null ? (user.getName() + " " + user.getSurname()).trim() : "Hincha";
    }
}
