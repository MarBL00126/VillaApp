package mariano.projects.appVillaSanMartin.models.responses;
import java.math.BigDecimal;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StadiumInfoResponse {
    private Integer id;
    private String name;
    private String address;
    private String city;
    private Integer capacity;
    private String mapUrl;
    private String parkingUrl;
    private BigDecimal latitude;
    private BigDecimal longitude;
}
