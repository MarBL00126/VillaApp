package mariano.projects.appVillaSanMartin.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import mariano.projects.appVillaSanMartin.entities.ReservationEntity;
import mariano.projects.appVillaSanMartin.entities.UserEntity;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;
import mariano.projects.appVillaSanMartin.services.ReservationService;

@RestController
@RequestMapping("/reservations")
public class ReservationController {

    private final ReservationService reservationService;
    private final UserRepository userRepository;

    public ReservationController(
            ReservationService reservationService,
            UserRepository userRepository) {

        this.reservationService = reservationService;
        this.userRepository = userRepository;
    }

    private UserEntity getAuthenticatedUser(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReservationEntity createReservation(
            Authentication authentication,
            @RequestBody CreateReservationRequest request) {

        UserEntity user = getAuthenticatedUser(authentication);

        return reservationService.createReservation(
                user,
                request.ticketTypeId(),
                request.quantity());
    }

    @GetMapping("/my")
    public List<ReservationEntity> getMyReservations(
            Authentication authentication) {

        UserEntity user = getAuthenticatedUser(authentication);
        return reservationService.getByUserId(user.getId());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancelReservation(
            @PathVariable int id,
            Authentication authentication) {

        UserEntity user = getAuthenticatedUser(authentication);
        reservationService.cancelReservation(id, user.getId());
    }

    public record CreateReservationRequest(
            int ticketTypeId,
            int quantity) {
    }
}
