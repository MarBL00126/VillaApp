package mariano.projects.appVillaSanMartin.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "badges")
@Data
public class BadgeEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(nullable = false, length = 100)
    private String name;
    @Column(columnDefinition = "TEXT")
    private String description;
    @Column(name = "image_url", length = 500)
    private String imageUrl;
    @Column(name = "required_points", nullable = false)
    private Integer requiredPoints = 0;
    @Column(nullable = false)
    private Boolean active = true;
}
