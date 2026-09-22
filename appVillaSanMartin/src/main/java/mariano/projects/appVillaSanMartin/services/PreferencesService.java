package mariano.projects.appVillaSanMartin.services;
import mariano.projects.appVillaSanMartin.entities.PlayerEntity;
import mariano.projects.appVillaSanMartin.entities.UserEntity;
import mariano.projects.appVillaSanMartin.entities.UserPreferencesEntity;
import mariano.projects.appVillaSanMartin.repositories.PlayerRepository;
import mariano.projects.appVillaSanMartin.repositories.UserPreferencesRepository;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
@Service
@RequiredArgsConstructor
public class PreferencesService {
    private final UserPreferencesRepository prefsRepository;
    private final UserRepository userRepository;
    private final PlayerRepository playerRepository;
    public UserPreferencesEntity getMyPreferences(int userId) {
        return prefsRepository.findByUser_Id(userId).orElseGet(() -> {
            UserEntity user = userRepository.findById(userId).orElseThrow();
            UserPreferencesEntity prefs = new UserPreferencesEntity();
            prefs.setUser(user);
            prefs.setUpdatedAt(LocalDateTime.now());
            return prefsRepository.save(prefs);
        });
    }
    public UserPreferencesEntity updatePreferences(int userId, UserPreferencesEntity updates) {
        UserPreferencesEntity prefs = getMyPreferences(userId);
        if (updates.getNotifyNews() != null) prefs.setNotifyNews(updates.getNotifyNews());
        if (updates.getNotifyVideos() != null) prefs.setNotifyVideos(updates.getNotifyVideos());
        if (updates.getNotifyFees() != null) prefs.setNotifyFees(updates.getNotifyFees());
        if (updates.getNotifyBenefits() != null) prefs.setNotifyBenefits(updates.getNotifyBenefits());
        if (updates.getNotifyMatchResults() != null) prefs.setNotifyMatchResults(updates.getNotifyMatchResults());
        prefs.setUpdatedAt(LocalDateTime.now());
        return prefsRepository.save(prefs);
    }
    @Transactional
    public UserPreferencesEntity setFavoritePlayer(int userId, int playerId) {
        UserPreferencesEntity prefs = getMyPreferences(userId);
        PlayerEntity previous = prefs.getFavoritePlayer();
        PlayerEntity player = playerRepository.findById(playerId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        prefs.setFavoritePlayer(player);
        prefs.setUpdatedAt(LocalDateTime.now());
        UserPreferencesEntity saved = prefsRepository.save(prefs);
        syncFavoriteCount(previous);
        syncFavoriteCount(player);
        return saved;
    }
    @Transactional
    public UserPreferencesEntity clearFavoritePlayer(int userId, int playerId) {
        UserPreferencesEntity prefs = getMyPreferences(userId);
        PlayerEntity previous = prefs.getFavoritePlayer();
        if (previous == null || previous.getId() != playerId) {
            return prefs;
        }
        prefs.setFavoritePlayer(null);
        prefs.setUpdatedAt(LocalDateTime.now());
        UserPreferencesEntity saved = prefsRepository.save(prefs);
        syncFavoriteCount(previous);
        return saved;
    }
    private void syncFavoriteCount(PlayerEntity player) {
        if (player == null) return;
        player.setFavoriteCount((int) prefsRepository.countByFavoritePlayer_Id(player.getId()));
        playerRepository.save(player);
    }
}
