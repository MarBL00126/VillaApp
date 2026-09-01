package mariano.projects.appVillaSanMartin.models.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ValidateQrRequest {
    @NotBlank(message = "Necessary entry code")
    String entryCode;
}
