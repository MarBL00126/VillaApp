package mariano.projects.appVillaSanMartin.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import mariano.projects.appVillaSanMartin.entities.UserEntity;
import mariano.projects.appVillaSanMartin.models.dto.DigitalCardDto;
import mariano.projects.appVillaSanMartin.models.dto.MembershipDto;
import mariano.projects.appVillaSanMartin.models.dto.MembershipTypeDto;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;
import mariano.projects.appVillaSanMartin.services.MembershipService;

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
    public List<MembershipTypeDto> getTypes() {
        return membershipService.getTypes();
    }

    @GetMapping("/my")
    public ResponseEntity<MembershipDto> getMyMembership(Authentication auth) {
        return membershipService.findMyMembership(getUser(auth).getId())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.noContent().build());
    }

    @GetMapping
    public ResponseEntity<MembershipDto> getMembership(Authentication auth) {
        return getMyMembership(auth);
    }

    @PostMapping("/signup")
    public MembershipDto signup(Authentication auth, @RequestBody MembershipSignupRequest request) {
        return membershipService.signup(getUser(auth).getId(), request.membershipTypeId());
    }

    @PostMapping
    public MembershipDto createMembership(Authentication auth, @RequestBody MembershipSignupRequest request) {
        return signup(auth, request);
    }

    @DeleteMapping
    public MembershipDto cancelMembership(Authentication auth) {
        return membershipService.cancel(getUser(auth).getId());
    }

    @GetMapping("/card")
    public DigitalCardDto getDigitalCard(Authentication auth) {
        return membershipService.getDigitalCard(getUser(auth).getId());
    }

    @GetMapping("/check/{memberNumber}")
    public MembershipDto getMemberByNumber(@PathVariable String memberNumber) {
        return membershipService.getMemberByNumber(memberNumber);
    }

    public record MembershipSignupRequest(int membershipTypeId) {
    }
}
