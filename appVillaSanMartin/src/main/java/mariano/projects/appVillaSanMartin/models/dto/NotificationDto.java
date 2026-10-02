package mariano.projects.appVillaSanMartin.models.dto;

import java.time.LocalDateTime;

import mariano.projects.appVillaSanMartin.entities.NotificationEntity;

public record NotificationDto(
        Integer id,
        String type,
        String title,
        String message,
        Boolean isRead,
        LocalDateTime createdAt) {

    public static NotificationDto from(NotificationEntity entity) {
        if (entity == null) {
            return null;
        }
        return new NotificationDto(
                entity.getId(),
                entity.getType(),
                entity.getTitle(),
                entity.getMessage(),
                entity.getIsRead(),
                entity.getCreatedAt());
    }
}
