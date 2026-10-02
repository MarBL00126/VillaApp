package mariano.projects.appVillaSanMartin.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import mariano.projects.appVillaSanMartin.entities.UserEntity;
import mariano.projects.appVillaSanMartin.models.dto.MembershipFeeDto;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;
import mariano.projects.appVillaSanMartin.services.MembershipFeeService;

@RestController
@RequestMapping("/api/fees")
@RequiredArgsConstructor
public class MembershipFeeController {
    private final MembershipFeeService feeService;
    private final UserRepository userRepository;

    private UserEntity getUser(Authentication auth) {
        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @GetMapping("/my")
    public List<MembershipFeeDto> getMyFees(Authentication auth) {
        return feeService.getMyFees(getUser(auth).getId());
    }

    @GetMapping("/my/pending")
    public List<MembershipFeeDto> getPendingFees(Authentication auth) {
        return feeService.getPendingFees(getUser(auth).getId());
    }

    @GetMapping("/{feeId}")
    public MembershipFeeDto getFeeById(@PathVariable int feeId) {
        return feeService.getFeeById(feeId);
    }

    @PostMapping("/{feeId}/pay")
    public Map<String, String> payFee(@PathVariable int feeId, Authentication auth) {
        String initPoint = feeService.createPaymentPreference(feeId, getUser(auth).getId());
        return Map.of("initPoint", initPoint);
    }
}
