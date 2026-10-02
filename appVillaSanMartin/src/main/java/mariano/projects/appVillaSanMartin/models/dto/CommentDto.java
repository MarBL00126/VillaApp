package mariano.projects.appVillaSanMartin.models.dto;

import java.time.LocalDateTime;

import mariano.projects.appVillaSanMartin.entities.CommentEntity;

public record CommentDto(
        Integer id,
        UserSummaryDto user,
        String targetType,
        Integer targetId,
        String content,
        LocalDateTime createdAt,
        String authorName) {

    public static CommentDto from(CommentEntity entity) {
        if (entity == null) {
            return null;
        }
        return new CommentDto(
                entity.getId(),
                UserSummaryDto.from(entity.getUser()),
                entity.getTargetType(),
                entity.getTargetId(),
                entity.getContent(),
                entity.getCreatedAt(),
                entity.getAuthorName());
    }
}
