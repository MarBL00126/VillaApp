package mariano.projects.appVillaSanMartin.models.dto;

import java.time.LocalDateTime;

import mariano.projects.appVillaSanMartin.entities.FavoriteNewsEntity;

public record FavoriteNewsDto(Integer id, NewsDto news, LocalDateTime createdAt) {

    public static FavoriteNewsDto from(FavoriteNewsEntity entity) {
        if (entity == null) {
            return null;
        }
        return new FavoriteNewsDto(entity.getId(), NewsDto.from(entity.getNews()), entity.getCreatedAt());
    }
}
