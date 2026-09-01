package mariano.projects.appVillaSanMartin.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import java.time.LocalDate;

@Entity(name = "Player")
@Table(name = "players")
@Data
public class PlayerEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(nullable = false, length = 100)
    private String name;
    @Column(nullable = false, length = 100)
    private String surname;
    @Column(nullable = false, length = 50)
    private String position;
    @Column(name = "shirt_number")
    private int shirtNumber;
    @Column
    private float height;
    @Column(nullable = false, length = 50)
    private String nationality;
    @Column(name = "birth_date", nullable = false)
    private LocalDate birthDate;
    @ManyToOne
    @JoinColumn(name = "team_id", nullable = false)
    private TeamEntity team;

}
