package mariano.projects.appVillaSanMartin.entities;
import jakarta.persistence.*;
import lombok.Data;
@Entity(name="Staff")
@Table(name="staff")
@Data
public class StaffEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne @JoinColumn(name="team_id")
    private TeamEntity team;
    @Column(nullable=false, length=100)
    private String name;
    @Column(nullable=false, length=100)
    private String role;
    @Column(name="photo_url", length=500)
    private String photoUrl;
    @Column(columnDefinition="TEXT")
    private String bio;
    @Column(nullable=false)
    private Boolean active = true;
}
