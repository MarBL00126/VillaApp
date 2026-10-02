package mariano.projects.appVillaSanMartin.models.dto;

import java.time.LocalDateTime;

import mariano.projects.appVillaSanMartin.entities.PollEntity;

public record PollDto(
        Integer id,
        String title,
        String type,
        MatchDto match,
        Boolean active,
        LocalDateTime closesAt,
        LocalDateTime createdAt) {

    public static PollDto from(PollEntity entity) {
        if (entity == null) {
            return null;
        }
        return new PollDto(
                entity.getId(),
                entity.getTitle(),
                entity.getType(),
                MatchDto.from(entity.getMatch()),
                entity.getActive(),
                entity.getClosesAt(),
                entity.getCreatedAt());
    }
}
