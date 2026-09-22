package mariano.projects.appVillaSanMartin.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "poll_votes")
@Data
public class PollVoteEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;
    @ManyToOne @JoinColumn(name = "poll_id", nullable = false)
    private PollEntity poll;
    @ManyToOne @JoinColumn(name = "option_id", nullable = false)
    private PollOptionEntity option;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
