package mariano.projects.appVillaSanMartin.models.requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateUserRequest {
    @NotBlank(message = "Necessary name")
    private String name;
    @NotBlank(message = "Necessary surname")
    private String surname;
    @NotBlank(message = "Necessary phone")
    private String phoneNumber;
    @NotBlank(message = "Necessary email")
    @Email(message = "email must be valid")
    private String email;
    @NotBlank(message = "Necessary password")
    private String password;

}
