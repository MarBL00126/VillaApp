package mariano.projects.appVillaSanMartin.controllers;
import mariano.projects.appVillaSanMartin.entities.BenefitEntity;
import mariano.projects.appVillaSanMartin.entities.UserEntity;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;
import mariano.projects.appVillaSanMartin.services.BenefitService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/benefits")
@RequiredArgsConstructor
public class BenefitController {
    private final BenefitService benefitService;
    private final UserRepository userRepository;
    private UserEntity getUser(Authentication auth) {
        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
    @GetMapping
    public List<BenefitEntity> getAll() {
        return benefitService.getAll();
    }
    @GetMapping("/my")
    public List<BenefitEntity> getForMember(Authentication auth) {
        return benefitService.getForMember(getUser(auth).getId());
    }
    @GetMapping("/{id}")
    public BenefitEntity getById(@PathVariable int id) {
        return benefitService.getById(id);
    }
}
