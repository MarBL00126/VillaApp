package mariano.projects.appVillaSanMartin.services;
import mariano.projects.appVillaSanMartin.entities.NotificationEntity;
import mariano.projects.appVillaSanMartin.entities.UserEntity;
import mariano.projects.appVillaSanMartin.repositories.NotificationRepository;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.util.List;
@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    public List<NotificationEntity> getMyNotifications(int userId) {
        return notificationRepository.findByUser_IdOrderByCreatedAtDesc(userId);
    }
    public List<NotificationEntity> getUnread(int userId) {
        return notificationRepository.findByUser_IdAndIsReadFalse(userId);
    }
    public NotificationEntity markRead(int notificationId, int userId) {
        NotificationEntity n = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (n.getUser().getId() != userId) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        n.setIsRead(true);
        return notificationRepository.save(n);
    }
    public void markAllRead(int userId) {
        List<NotificationEntity> unread = notificationRepository.findByUser_IdAndIsReadFalse(userId);
        unread.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(unread);
    }
    public long countUnread(int userId) {
        return notificationRepository.countByUser_IdAndIsReadFalse(userId);
    }
    public NotificationEntity createNotification(int userId, String type, String title, String message) {
        UserEntity user = userRepository.findById(userId).orElseThrow();
        NotificationEntity n = new NotificationEntity();
        n.setUser(user);
        n.setType(type);
        n.setTitle(title);
        n.setMessage(message);
        n.setIsRead(false);
        n.setCreatedAt(LocalDateTime.now());
        return notificationRepository.save(n);
    }
}
