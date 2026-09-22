package mariano.projects.appVillaSanMartin.services;
import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
@Service
@RequiredArgsConstructor
public class FavoriteNewsService {
    private final FavoriteNewsRepository favRepo;
    private final UserRepository userRepo;
    private final NewsRepository newsRepo;
    public List<FavoriteNewsEntity> getMyFavorites(int userId) { return favRepo.findByUserId(userId); }
    public void addFavorite(int userId, int newsId) {
        if (!favRepo.existsByUserIdAndNewsId(userId, newsId)) {
            FavoriteNewsEntity f = new FavoriteNewsEntity();
            f.setUser(userRepo.findById(userId).orElseThrow());
            f.setNews(newsRepo.findById(newsId).orElseThrow());
            f.setCreatedAt(LocalDateTime.now());
            favRepo.save(f);
        }
    }
    public void removeFavorite(int userId, int newsId) {
        favRepo.findAll().stream().filter(f -> f.getUser().getId() == userId
                  && f.getNews().getId() == newsId)
            .findFirst().ifPresent(favRepo::delete);
    }
    public boolean isFavorite(int userId, int newsId) { return favRepo.existsByUserIdAndNewsId(userId, newsId); }
}
