package mariano.projects.appVillaSanMartin.controllers;
import mariano.projects.appVillaSanMartin.entities.MembershipFeeEntity;
import mariano.projects.appVillaSanMartin.entities.UserEntity;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;
import mariano.projects.appVillaSanMartin.services.MembershipFeeService;
import mariano.projects.appVillaSanMartin.services.MembershipService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/fees")
@RequiredArgsConstructor
public class MembershipFeeController {
    private final MembershipFeeService feeService;
    private final MembershipService membershipService;
    private final UserRepository userRepository;
    private UserEntity getUser(Authentication auth) {
        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
    @GetMapping("/my")
    public List<MembershipFeeEntity> getMyFees(Authentication auth) {
        return feeService.getMyFees(getUser(auth).getId());
    }
    @GetMapping("/my/pending")
    public List<MembershipFeeEntity> getPendingFees(Authentication auth) {
        return feeService.getPendingFees(getUser(auth).getId());
    }
    @GetMapping("/{feeId}")
    public MembershipFeeEntity getFeeById(@PathVariable int feeId) {
        return feeService.getFeeById(feeId);
    }
    @PostMapping("/{feeId}/pay")
    public Map<String, String> payFee(@PathVariable int feeId, Authentication auth) {
        String initPoint = feeService.createPaymentPreference(feeId, getUser(auth).getId());
        return Map.of("initPoint", initPoint);
    }
}
