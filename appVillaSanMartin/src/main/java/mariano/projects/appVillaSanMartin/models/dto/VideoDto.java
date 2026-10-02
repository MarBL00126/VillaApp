package mariano.projects.appVillaSanMartin.models.dto;

import java.time.LocalDateTime;

import mariano.projects.appVillaSanMartin.entities.VideoEntity;

public record VideoDto(
        Integer id,
        String title,
        String description,
        String url,
        String thumbnail,
        String type,
        LocalDateTime publishedAt) {

    public static VideoDto from(VideoEntity entity) {
        if (entity == null) {
            return null;
        }
        return new VideoDto(
                entity.getId(),
                entity.getTitle(),
                entity.getDescription(),
                entity.getUrl(),
                entity.getThumbnail(),
                entity.getType(),
                entity.getPublishedAt());
    }
}
