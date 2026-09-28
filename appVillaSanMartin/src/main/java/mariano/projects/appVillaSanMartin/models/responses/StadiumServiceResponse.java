package mariano.projects.appVillaSanMartin.models.responses;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StadiumServiceResponse {
    private Integer id;
    private String type;
    private String name;
    private String location;
    private Integer sectorId;
}
