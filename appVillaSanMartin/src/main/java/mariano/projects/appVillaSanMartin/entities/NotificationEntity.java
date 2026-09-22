package mariano.projects.appVillaSanMartin.entities;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
@Entity(name="Notification")
@Table(name="notifications")
@Data
public class NotificationEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne @JoinColumn(name="user_id", nullable=false)
    private UserEntity user;
    @Column(nullable=false, length=50)
    private String type;
    @Column(nullable=false, length=200)
    private String title;
    @Column(nullable=false, columnDefinition="TEXT")
    private String message;
    @Column(name="is_read", nullable=false)
    private Boolean isRead = false;
    @Column(name="created_at")
    private LocalDateTime createdAt;
}
