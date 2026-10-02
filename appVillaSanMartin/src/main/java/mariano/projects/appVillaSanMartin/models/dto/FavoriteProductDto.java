package mariano.projects.appVillaSanMartin.models.dto;

import java.time.LocalDateTime;

import mariano.projects.appVillaSanMartin.entities.FavoriteProductEntity;

public record FavoriteProductDto(
        int id,
        ProductDto product,
        LocalDateTime createdAt) {

    public static FavoriteProductDto from(FavoriteProductEntity e) {
        if (e == null) return null;
        return new FavoriteProductDto(
                e.getId(),
                ProductDto.from(e.getProduct()),
                e.getCreatedAt());
    }
}
