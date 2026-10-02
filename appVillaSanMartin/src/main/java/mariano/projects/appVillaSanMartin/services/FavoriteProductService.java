package mariano.projects.appVillaSanMartin.services;

import lombok.RequiredArgsConstructor;
import mariano.projects.appVillaSanMartin.entities.FavoriteProductEntity;
import mariano.projects.appVillaSanMartin.models.dto.FavoriteProductDto;
import mariano.projects.appVillaSanMartin.repositories.FavoriteProductRepository;
import mariano.projects.appVillaSanMartin.repositories.ProductRepository;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteProductService {
    private final FavoriteProductRepository favRepo;
    private final UserRepository userRepo;
    private final ProductRepository prodRepo;

    @Transactional(readOnly = true)
    public List<FavoriteProductDto> getMyFavorites(int userId) {
        return favRepo.findByUserId(userId).stream().map(FavoriteProductDto::from).toList();
    }

    @Transactional
    public void addFavorite(int userId, int productId) {
        if (!favRepo.existsByUserIdAndProductId(userId, productId)) {
            FavoriteProductEntity fav = new FavoriteProductEntity();
            fav.setUser(userRepo.findById(userId).orElseThrow());
            fav.setProduct(prodRepo.findById(productId).orElseThrow());
            fav.setCreatedAt(LocalDateTime.now());
            favRepo.save(fav);
        }
    }

    @Transactional
    public void removeFavorite(int userId, int productId) {
        favRepo.findByUserIdAndProductId(userId, productId).ifPresent(favRepo::delete);
    }

    public boolean isFavorite(int userId, int productId) {
        return favRepo.existsByUserIdAndProductId(userId, productId);
    }
}
