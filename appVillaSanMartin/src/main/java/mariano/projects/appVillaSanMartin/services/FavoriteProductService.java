package mariano.projects.appVillaSanMartin.services;
import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.util.List;
@Service
@RequiredArgsConstructor
public class FavoriteProductService {
    private final FavoriteProductRepository favRepo;
    private final UserRepository userRepo;
    private final ProductRepository prodRepo;
    public List<FavoriteProductEntity> getMyFavorites(int userId) {
        return favRepo.findByUserId(userId);
    }
    public void addFavorite(int userId, int productId) {
        if (!favRepo.existsByUserIdAndProductId(userId, productId)) {
            FavoriteProductEntity fav = new FavoriteProductEntity();
            fav.setUser(userRepo.findById(userId).orElseThrow());
            fav.setProduct(prodRepo.findById(productId).orElseThrow());
            fav.setCreatedAt(LocalDateTime.now());
            favRepo.save(fav);
        }
    }
    public void removeFavorite(int userId, int productId) {
        favRepo.findByUserIdAndProductId(userId, productId).ifPresent(favRepo::delete);
    }
    public boolean isFavorite(int userId, int productId) {
        return favRepo.existsByUserIdAndProductId(userId, productId);
    }
}
