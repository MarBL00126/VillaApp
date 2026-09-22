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

                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.POST, "/api/players/*/favorite").authenticated()
                                                .requestMatchers(HttpMethod.DELETE, "/api/players/*/favorite").authenticated()
                                                .requestMatchers("/api/benefits/my").authenticated()
                                                .requestMatchers(
                                                                "/",
                                                                "/index.html",
                                                                "/assets/**",
                                                                "/favicon.ico",
                                                                "/favicon.svg",
                                                                "/icons.svg",
                                                                "/health",
                                                                "/error",
                                                                "/actuator/health",
                                                                "/login", "/register", "/players/**", "/fixture",
                                                                "/stats", "/profile", "/matches/**", "/orders/**",
                                                                "/payment/**", "/admin/**",
                                                                "/game/**", "/rewards/**", "/community/**",
                                                                "/cantina/**", "/shop/**", "/news/**", "/media/**",
                                                                "/api/users/register", "/api/users/login",
                                                                "/api/auth/**",
                                                                "/api/teams/**", "/api/team/**", "/api/players/**", "/api/matches/**",
                                                                "/api/fixture/**", "/api/stats/**", "/api/webhooks/**",
                                                                "/api/products/**", "/api/news/**", "/api/galleries/**",
                                                                "/api/videos/**", "/api/cantina/**", "/api/cantina/orders/track/**",
                                                                "/api/membership/types", "/api/membership/check/**",
                                                                "/api/benefits", "/api/benefits/**",
                                                                "/api/staff", "/api/staff/**")
                                                .permitAll()
                                                .requestMatchers("/api/reservations/**").authenticated()
                                                .requestMatchers("/api/orders/validate-qr").hasRole("ADMIN")
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
