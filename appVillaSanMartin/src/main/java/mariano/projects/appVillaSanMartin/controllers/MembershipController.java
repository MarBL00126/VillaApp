package mariano.projects.appVillaSanMartin.controllers;
import mariano.projects.appVillaSanMartin.entities.MembershipEntity;
import mariano.projects.appVillaSanMartin.entities.MembershipTypeEntity;
import mariano.projects.appVillaSanMartin.entities.UserEntity;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;
import mariano.projects.appVillaSanMartin.services.MembershipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/membership")
@RequiredArgsConstructor
public class MembershipController {
    private final MembershipService membershipService;
    private final UserRepository userRepository;
    private UserEntity getUser(Authentication auth) {
        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
    @GetMapping("/types")
    public List<MembershipTypeEntity> getTypes() {
        return membershipService.getTypes();
    }
    @GetMapping("/my")
    public ResponseEntity<MembershipEntity> getMyMembership(Authentication auth) {
        return membershipService.findMyMembership(getUser(auth).getId())
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.noContent().build());
    }
    @GetMapping
    public ResponseEntity<MembershipEntity> getMembership(Authentication auth) {
        return getMyMembership(auth);
    }
    @PostMapping("/signup")
    public MembershipEntity signup(Authentication auth, @RequestBody Map<String, Integer> body) {
        return membershipService.signup(getUser(auth).getId(), body.get("membershipTypeId"));
    }
    @PostMapping
    public MembershipEntity createMembership(Authentication auth, @RequestBody Map<String, Integer> body) {
        return signup(auth, body);
    }
    @DeleteMapping
    public MembershipEntity cancelMembership(Authentication auth) {
        return membershipService.cancel(getUser(auth).getId());
    }
    @GetMapping("/card")
    public Map<String, Object> getDigitalCard(Authentication auth) {
        return membershipService.getDigitalCard(getUser(auth).getId());
    }
    @GetMapping("/check/{memberNumber}")
    public MembershipEntity getMemberByNumber(@PathVariable String memberNumber) {
        return membershipService.getMemberByNumber(memberNumber);
    }
}
