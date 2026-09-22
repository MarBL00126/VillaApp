package mariano.projects.appVillaSanMartin.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;
import mariano.projects.appVillaSanMartin.entities.Role;
import mariano.projects.appVillaSanMartin.entities.UserEntity;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;

@Slf4j
@Component
public class AdminBootstrap implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final String adminEmail;
    private final String adminPassword;
    private final String adminName;
    private final String adminSurname;
    private final String adminPhone;

    public AdminBootstrap(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.email:}") String adminEmail,
            @Value("${app.admin.password:}") String adminPassword,
            @Value("${app.admin.name:Admin}") String adminName,
            @Value("${app.admin.surname:Villa}") String adminSurname,
            @Value("${app.admin.phone:0000000000}") String adminPhone) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
        this.adminName = adminName;
        this.adminSurname = adminSurname;
        this.adminPhone = adminPhone;
    }

    @Override
    public void run(String... args) {
        if (adminEmail == null || adminEmail.isBlank() || adminPassword == null || adminPassword.isBlank()) {
            return;
        }

        UserEntity admin = userRepository.findByEmail(adminEmail.trim())
                .orElseGet(UserEntity::new);
        admin.setEmail(adminEmail.trim());
        admin.setPassword(passwordEncoder.encode(adminPassword));
        admin.setName(admin.getName() == null ? adminName : admin.getName());
        admin.setSurname(admin.getSurname() == null ? adminSurname : admin.getSurname());
        admin.setPhoneNumber(admin.getPhoneNumber() == null ? adminPhone : admin.getPhoneNumber());
        admin.setRole(Role.ADMIN);
        userRepository.save(admin);
        log.info("Cuenta administradora disponible para {}", adminEmail.trim());
    }
}
