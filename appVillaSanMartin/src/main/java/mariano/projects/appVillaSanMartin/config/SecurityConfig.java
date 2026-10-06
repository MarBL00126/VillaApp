package mariano.projects.appVillaSanMartin.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
        private final JwtAuthFilter jwtAuthFilter;

        public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
                this.jwtAuthFilter = jwtAuthFilter;
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration config = new CorsConfiguration();
                config.setAllowedOrigins(List.of(
                                "http://localhost:5173",
                                "https://villaapp-production.up.railway.app"));
                config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
                config.setAllowedHeaders(List.of("*"));
                config.setExposedHeaders(List.of("X-Total-Count"));
                config.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", config);
                return source;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .csrf(csrf -> csrf.disable())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                                // CRÍTICO-1 FIX: Las reglas restrictivas van PRIMERO.
                                // Spring Security evalúa top-down y aplica la primera que coincide.
                                // Un patrón /** en permitAll() al final ya NO puede sobreescribir
                                // las reglas específicas de ADMIN/authenticated declaradas aquí arriba.
                                .authorizeHttpRequests(auth -> auth

                                                // --- Rutas exclusivas de ADMIN ---
                                                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                                                .requestMatchers("/api/orders/validate-qr").hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.POST, "/api/orders/*/confirm-payment").hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.PUT, "/api/game-center/*/state").hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.POST, "/api/game-center/*/plays").hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.PUT, "/api/game-center/*/box-score/*").hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.POST, "/api/game-center/*/shot-chart").hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.POST, "/api/standings").hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.PUT, "/api/standings/*").hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.PATCH, "/api/cantina/info/status").hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.PATCH, "/api/cantina/orders/*/status").hasRole("ADMIN")

                                                // --- Rutas que requieren login ---
                                                .requestMatchers("/api/reservations/**").authenticated()
                                                .requestMatchers(HttpMethod.POST, "/api/cantina/orders").authenticated()
                                                .requestMatchers(HttpMethod.POST, "/api/cantina/orders/").authenticated()
                                                .requestMatchers(HttpMethod.GET, "/api/cantina/orders/my").authenticated()
                                                .requestMatchers(HttpMethod.POST, "/api/players/*/favorite").authenticated()
                                                .requestMatchers(HttpMethod.DELETE, "/api/players/*/favorite").authenticated()
                                                .requestMatchers("/api/benefits/my").authenticated()

                                                // --- Rutas completamente públicas ---
                                                // Assets y SPA shell
                                                .requestMatchers(
                                                                "/",
                                                                "/index.html",
                                                                "/assets/**",
                                                                "/*.js",
                                                                "/*.css",
                                                                "/*.png",
                                                                "/*.svg",
                                                                "/*.ico",
                                                                "/uploads/**",
                                                                "/*.webmanifest",
                                                                "/favicon.ico",
                                                                "/favicon.svg",
                                                                "/apple-touch-icon.png",
                                                                "/manifest.webmanifest",
                                                                "/registerSW.js",
                                                                "/sw.js",
                                                                "/icons.svg",
                                                                "/**/favicon.svg",
                                                                "/**/manifest.webmanifest",
                                                                "/**/registerSW.js",
                                                                "/health",
                                                                "/error",
                                                                "/actuator/health").permitAll()
                                                // Rutas SPA (frontend routes)
                                                .requestMatchers(
                                                                "/login", "/register", "/players/**", "/fixture",
                                                                "/stats", "/stats/**", "/profile", "/matches/**", "/orders/**",
                                                                "/payment/**", "/admin/**",
                                                                "/game/**", "/rewards/**", "/community/**",
                                                                "/cantina/**", "/shop/**", "/news/**", "/media/**",
                                                                "/stadium", "/standings", "/press/**", "/fees",
                                                                "/team", "/notifications", "/preferences",
                                                                "/membership/**", "/benefits").permitAll()
                                                // Auth API
                                                .requestMatchers(
                                                                "/api/users/register",
                                                                "/api/users/login",
                                                                "/api/auth/**").permitAll()
                                                // Datos de lectura pública
                                                .requestMatchers(
                                                                "/api/teams/**", "/api/team/**",
                                                                "/api/players/**",
                                                                "/api/matches/**", "/api/fixture/**",
                                                                "/api/stats/**",
                                                                "/api/webhooks/**",
                                                                "/api/standings/**",
                                                                "/api/products/**",
                                                                "/api/news/**",
                                                                "/api/galleries/**",
                                                                "/api/videos/**",
                                                                "/api/membership/types",
                                                                "/api/membership/check/**",
                                                                "/api/benefits",
                                                                "/api/benefits/**",
                                                                "/api/staff",
                                                                "/api/staff/**").permitAll()
                                                // Cantina: solo lectura pública (menú / info / tracking)
                                                // Los endpoints de creación/gestión de pedidos están protegidos arriba
                                                .requestMatchers(HttpMethod.GET, "/api/cantina/**").permitAll()
                                                .requestMatchers("/api/cantina/orders/track/**").permitAll()
                                                // game-center: solo lectura pública (estado, jugadas, box-score)
                                                // Las escrituras de ADMIN ya están protegidas arriba
                                                .requestMatchers(HttpMethod.GET, "/api/game-center/**").permitAll()

                                                // Cualquier otra ruta requiere autenticación
                                                .anyRequest().authenticated())

                                .exceptionHandling(exception -> exception
                                                .authenticationEntryPoint(
                                                                (request, response, authException) -> response
                                                                                .sendError(
                                                                                                HttpServletResponse.SC_UNAUTHORIZED,
                                                                                                "No autenticado")))
                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
                return http.build();
        }
}
