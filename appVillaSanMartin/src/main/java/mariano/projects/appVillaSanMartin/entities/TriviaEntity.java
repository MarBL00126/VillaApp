package mariano.projects.appVillaSanMartin.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "trivias")
@Data
public class TriviaEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(nullable = false, length = 200)
    private String title;
    @Column(columnDefinition = "TEXT")
    private String description;
    @Column(nullable = false)
    private Integer points = 10;
    @Column(nullable = false)
    private Boolean active = true;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
