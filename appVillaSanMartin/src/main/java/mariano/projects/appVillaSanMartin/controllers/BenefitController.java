package mariano.projects.appVillaSanMartin.controllers;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import mariano.projects.appVillaSanMartin.entities.UserEntity;
import mariano.projects.appVillaSanMartin.models.dto.BenefitDto;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;
import mariano.projects.appVillaSanMartin.services.BenefitService;

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
    public List<BenefitDto> getAll() {
        return benefitService.getAll();
    }

    @GetMapping("/my")
    public List<BenefitDto> getForMember(Authentication auth) {
        return benefitService.getForMember(getUser(auth).getId());
    }

    @GetMapping("/{id}")
    public BenefitDto getById(@PathVariable int id) {
        return benefitService.getById(id);
    }
}
