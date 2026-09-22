package mariano.projects.appVillaSanMartin.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "polls")
@Data
public class PollEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(nullable = false, length = 300)
    private String title;
    @Column(nullable = false, length = 30)
    private String type = "POLL";
    @ManyToOne @JoinColumn(name = "match_id")
    private MatchEntity match;
    @Column(nullable = false)
    private Boolean active = true;
    @Column(name = "closes_at")
    private LocalDateTime closesAt;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
