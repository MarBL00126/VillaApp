package mariano.projects.appVillaSanMartin.controllers;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import mariano.projects.appVillaSanMartin.entities.UserEntity;
import mariano.projects.appVillaSanMartin.models.requests.PressAccreditationRequest;
import mariano.projects.appVillaSanMartin.models.responses.PressAccreditationResponse;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;
import mariano.projects.appVillaSanMartin.services.PressAccreditationService;

@RestController 
@RequestMapping ("/api/press")
@RequiredArgsConstructor 
public class PressAccreditationController {
    private final PressAccreditationService pressAccreditationService;
    private final UserRepository userRepository;
    private UserEntity getUser(Authentication auth) {
        UserDetails details = (UserDetails) auth.getPrincipal();
        return userRepository.findByEmail(details.getUsername()).orElseThrow();
    }
    @PostMapping
    public PressAccreditationResponse request(@RequestBody PressAccreditationRequest request,Authentication auth){
        final int userId=getUser(auth).getId();
        return pressAccreditationService.request(request, userId);
    }
    @GetMapping("/my")
    public List<PressAccreditationResponse> myAccreditations(Authentication auth){
        final int userId=getUser(auth).getId();
        return pressAccreditationService.getMyAccreditations(userId);
    }
}
