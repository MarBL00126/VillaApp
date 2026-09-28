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

@Entity(name="StadiumService")
@Table(name="stadium_services")
@Data 
public class StadiumServiceEntity {
    @Id 
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne 
    @JoinColumn(name="sector_id")
    private StadiumSectorEntity sector;
    @Column(nullable = false, length = 30)
    private String type;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 200)
    private String location;

    @Column(nullable = false)
    private Boolean active = true;
}
