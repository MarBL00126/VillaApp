package mariano.projects.appVillaSanMartin.models.dto;

import java.time.LocalDateTime;

import mariano.projects.appVillaSanMartin.entities.TriviaEntity;

public record TriviaDto(
        Integer id,
        String title,
        String description,
        Integer points,
        Boolean active,
        LocalDateTime createdAt) {

    public static TriviaDto from(TriviaEntity entity) {
        if (entity == null) {
            return null;
        }
        return new TriviaDto(
                entity.getId(),
                entity.getTitle(),
                entity.getDescription(),
                entity.getPoints(),
                entity.getActive(),
                entity.getCreatedAt());
    }
}
