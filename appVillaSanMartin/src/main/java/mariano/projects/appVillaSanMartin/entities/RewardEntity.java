package mariano.projects.appVillaSanMartin.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "rewards")
@Data
public class RewardEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(nullable = false, length = 200)
    private String name;
    @Column(columnDefinition = "TEXT")
    private String description;
    @Column(name = "points_cost", nullable = false)
    private Integer pointsCost;
    @Column(nullable = false, length = 50)
    private String type;
    private Integer stock;
    @Column(nullable = false)
    private Boolean active = true;
}
