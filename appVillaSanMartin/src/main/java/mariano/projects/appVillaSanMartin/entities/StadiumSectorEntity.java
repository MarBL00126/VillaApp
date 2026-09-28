package mariano.projects.appVillaSanMartin.entities;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity(name="StadiumSector")
@Table(name="stadium_sectors")
@Data 
public class StadiumSectorEntity {
    @Id 
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 30)
    private String type;

    @Column(length = 20)
    private String gate;

    private Integer capacity;

    @Column(name = "color_hex", length = 7)
    private String colorHex;

    @Column(length = 300)
    private String description;

    @Column(nullable = false)
    private Boolean active = true;

    
}
 