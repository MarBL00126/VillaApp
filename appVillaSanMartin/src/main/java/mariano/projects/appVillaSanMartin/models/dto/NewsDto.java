package mariano.projects.appVillaSanMartin.models.dto;

import java.time.LocalDateTime;

import mariano.projects.appVillaSanMartin.entities.NewsEntity;

public record NewsDto(
        Integer id,
        String title,
        String summary,
        String content,
        String imageUrl,
        Boolean featured,
        String author,
        LocalDateTime publishedAt,
        NewsCategoryDto category) {

    public static NewsDto from(NewsEntity entity) {
        if (entity == null) {
            return null;
        }
        return new NewsDto(
                entity.getId(),
                entity.getTitle(),
                entity.getSummary(),
                entity.getContent(),
                entity.getImageUrl(),
                entity.getFeatured(),
                entity.getAuthor(),
                entity.getPublishedAt(),
                NewsCategoryDto.from(entity.getCategory()));
    }
}
