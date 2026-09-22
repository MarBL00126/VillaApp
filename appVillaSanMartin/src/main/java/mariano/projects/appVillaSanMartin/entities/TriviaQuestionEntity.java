package mariano.projects.appVillaSanMartin.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "trivia_questions")
@Data
public class TriviaQuestionEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "trivia_id", nullable = false)
    private Integer triviaId;
    @Column(nullable = false, length = 500)
    private String question;
    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 0;
}
