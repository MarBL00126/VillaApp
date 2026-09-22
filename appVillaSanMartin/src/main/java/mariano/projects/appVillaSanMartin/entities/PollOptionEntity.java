package mariano.projects.appVillaSanMartin.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "poll_options")
@Data
public class PollOptionEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "poll_id", nullable = false)
    private Integer pollId;
    @Column(nullable = false, length = 200)
    private String text;
    @ManyToOne @JoinColumn(name = "player_id")
    private PlayerEntity player;
    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 0;
}
