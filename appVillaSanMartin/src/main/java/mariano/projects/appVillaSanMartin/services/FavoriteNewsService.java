package mariano.projects.appVillaSanMartin.services;

import java.time.LocalDateTime;
import java.util.List;

import lombok.RequiredArgsConstructor;
import mariano.projects.appVillaSanMartin.entities.FavoriteNewsEntity;
import mariano.projects.appVillaSanMartin.models.dto.FavoriteNewsDto;
import mariano.projects.appVillaSanMartin.repositories.FavoriteNewsRepository;
import mariano.projects.appVillaSanMartin.repositories.NewsRepository;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FavoriteNewsService {
    private final FavoriteNewsRepository favRepo;
    private final UserRepository userRepo;
    private final NewsRepository newsRepo;

    @Transactional(readOnly = true)
    public List<FavoriteNewsDto> getMyFavorites(int userId) {
        return favRepo.findByUserId(userId).stream().map(FavoriteNewsDto::from).toList();
    }

    public void addFavorite(int userId, int newsId) {
        if (!favRepo.existsByUserIdAndNewsId(userId, newsId)) {
            FavoriteNewsEntity favorite = new FavoriteNewsEntity();
            favorite.setUser(userRepo.findById(userId).orElseThrow());
            favorite.setNews(newsRepo.findById(newsId).orElseThrow());
            favorite.setCreatedAt(LocalDateTime.now());
            favRepo.save(favorite);
        }
    }

    public void removeFavorite(int userId, int newsId) {
        favRepo.findAll().stream().filter(favorite -> favorite.getUser().getId() == userId
                  && favorite.getNews().getId() == newsId)
            .findFirst().ifPresent(favRepo::delete);
    }

    public boolean isFavorite(int userId, int newsId) { return favRepo.existsByUserIdAndNewsId(userId, newsId); }
}
