package mariano.projects.appVillaSanMartin.models.requests;

import jakarta.validation.constraints.NotBlank;

public record RefreshTokenRequest(@NotBlank(message = "Necessary refresh token") String refreshToken) {
}