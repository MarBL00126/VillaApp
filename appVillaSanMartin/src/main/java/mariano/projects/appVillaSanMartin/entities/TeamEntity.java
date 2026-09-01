package mariano.projects.appVillaSanMartin.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity(name = "Team")
@Table(name = "teams")
@Data
public class TeamEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(nullable = false, unique = true, length = 50)
    private String name;
    @Column(nullable = false, length = 50)
    private String city;
    @Column(name = "short_name", nullable = false, length = 50)
    private String shortName;
    @Column(nullable = false, length = 50)
    private String category;
    @Column(name = "logo_url", nullable = false, length = 255)
    private String logoUrl;
    @Column(nullable = false, length = 50)
    private String stadium;
    @Column(name = "primary_team", nullable = false)
    private boolean primaryTeam = false;
    @Column(nullable = false)
    private boolean active = true;
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
