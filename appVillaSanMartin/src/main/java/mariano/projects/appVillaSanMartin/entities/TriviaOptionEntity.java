package mariano.projects.appVillaSanMartin.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "trivia_options")
@Data
public class TriviaOptionEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "question_id", nullable = false)
    private Integer questionId;
    @Column(nullable = false, length = 300)
    private String text;
    @Column(name = "is_correct", nullable = false)
    private Boolean isCorrect = false;
}
