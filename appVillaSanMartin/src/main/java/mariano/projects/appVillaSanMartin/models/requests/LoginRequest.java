package mariano.projects.appVillaSanMartin.models.requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "Necessary email")
    @Email(message = "email must be valid")
    private String email;
    @NotBlank(message = "Necessary password")
    private String password;
}
