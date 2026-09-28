package mariano.projects.appVillaSanMartin.models.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StadiumSectorResponse {
    private Integer id;
    private String name;
    private String type;
    private String gate;
    private Integer capacity;
    private String colorHex;
    private String description;
}
