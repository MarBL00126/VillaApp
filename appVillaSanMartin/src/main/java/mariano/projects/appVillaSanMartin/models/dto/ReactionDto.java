package mariano.projects.appVillaSanMartin.models.dto;

import java.time.LocalDateTime;

import mariano.projects.appVillaSanMartin.entities.ReactionEntity;

public record ReactionDto(
        Integer id,
        UserSummaryDto user,
        String targetType,
        Integer targetId,
        String type,
        LocalDateTime createdAt) {

    public static ReactionDto from(ReactionEntity entity) {
        if (entity == null) {
            return null;
        }
        return new ReactionDto(
                entity.getId(),
                UserSummaryDto.from(entity.getUser()),
                entity.getTargetType(),
                entity.getTargetId(),
                entity.getType(),
                entity.getCreatedAt());
    }
}
