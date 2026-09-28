package mariano.projects.appVillaSanMartin.models.responses;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccessSummaryResponse {
    private long total;
    private long ok;
    private long duplicates;
    private long invalid;
}
