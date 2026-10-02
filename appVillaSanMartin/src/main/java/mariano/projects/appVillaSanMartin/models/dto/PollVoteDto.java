package mariano.projects.appVillaSanMartin.models.dto;

import java.time.LocalDateTime;

import mariano.projects.appVillaSanMartin.entities.PollVoteEntity;

public record PollVoteDto(
        Integer id,
        UserSummaryDto user,
        PollDto poll,
        PollOptionDto option,
        LocalDateTime createdAt) {

    public static PollVoteDto from(PollVoteEntity entity) {
        if (entity == null) {
            return null;
        }
        return new PollVoteDto(
                entity.getId(),
                UserSummaryDto.from(entity.getUser()),
                PollDto.from(entity.getPoll()),
                PollOptionDto.from(entity.getOption()),
                entity.getCreatedAt());
    }
}
