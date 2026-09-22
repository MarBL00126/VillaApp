package mariano.projects.appVillaSanMartin.controllers;
import mariano.projects.appVillaSanMartin.entities.NotificationEntity;
import mariano.projects.appVillaSanMartin.entities.UserEntity;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;
import mariano.projects.appVillaSanMartin.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private UserEntity getUser(Authentication auth) {
        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
    @GetMapping
    public List<NotificationEntity> getMyNotifications(Authentication auth) {
        return notificationService.getMyNotifications(getUser(auth).getId());
    }
    @GetMapping("/unread-count")
    public Map<String, Long> getUnreadCount(Authentication auth) {
        return Map.of("count", notificationService.countUnread(getUser(auth).getId()));
    }
    @PatchMapping("/{id}/read")
    public NotificationEntity markRead(@PathVariable int id, Authentication auth) {
        return notificationService.markRead(id, getUser(auth).getId());
    }
    @PatchMapping("/read-all")
    public void markAllRead(Authentication auth) {
        notificationService.markAllRead(getUser(auth).getId());
    }
}
