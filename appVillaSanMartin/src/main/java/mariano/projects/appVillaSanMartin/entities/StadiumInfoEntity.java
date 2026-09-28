package mariano.projects.appVillaSanMartin.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity(name="StadiumInfo")
@Table(name="stadium_info")
@Data 
public class StadiumInfoEntity {
    @Id 
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 300)
    private String address;

    @Column(length = 100)
    private String city;

    private Integer capacity;

    @Column(name = "map_url", length = 500)
    private String mapUrl;

    @Column(name = "parking_url", length = 500)
    private String parkingUrl;

    @Column(precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(precision = 10, scale = 7)
    private BigDecimal longitude;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}


