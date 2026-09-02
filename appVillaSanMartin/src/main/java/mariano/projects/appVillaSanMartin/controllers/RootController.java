package mariano.projects.appVillaSanMartin.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class RootController {

    @GetMapping("/")
    public String index() {
        return "forward:/index.html";
    }

    // Soporta rutas del SPA (React Router) al refrescar o entrar directo, ej: /fixture, /players/1
    @GetMapping({
            "/login", "/register", "/players/**", "/fixture", "/stats", "/profile",
            "/matches/**", "/orders/**", "/payment/**", "/admin/**"
    })
    public String spaFallback() {
        return "forward:/index.html";
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP"));
    }
}
