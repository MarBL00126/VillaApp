package mariano.projects.appVillaSanMartin.controllers;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import jakarta.validation.Valid;
import mariano.projects.appVillaSanMartin.models.requests.RefreshTokenRequest;
import mariano.projects.appVillaSanMartin.services.RefreshTokenService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final RefreshTokenService refreshTokenService;

    public AuthController(RefreshTokenService refreshTokenService) {
        this.refreshTokenService = refreshTokenService;
    }

    // Rota el refresh token: el recibido queda revocado y se devuelve uno nuevo junto al JWT.
    @PostMapping("/refresh")
    public Map<String, String> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return refreshTokenService.refresh(request.refreshToken());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody RefreshTokenRequest request) {
        try {
            refreshTokenService.revoke(request.refreshToken());
        } catch (ResponseStatusException ex) {
            if (ex.getStatusCode() != HttpStatus.NOT_FOUND) {
                throw ex;
            }
        }
        return ResponseEntity.noContent().build();
    }
}