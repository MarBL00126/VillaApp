package mariano.projects.appVillaSanMartin.models.dto;

import java.time.LocalDateTime;

import mariano.projects.appVillaSanMartin.entities.TriviaAttemptEntity;

public record TriviaAttemptDto(
        Integer id,
        UserSummaryDto user,
        TriviaDto trivia,
        Integer score,
        Integer pointsAwarded,
        LocalDateTime completedAt) {

    public static TriviaAttemptDto from(TriviaAttemptEntity entity) {
        if (entity == null) {
            return null;
        }
        return new TriviaAttemptDto(
                entity.getId(),
                UserSummaryDto.from(entity.getUser()),
                TriviaDto.from(entity.getTrivia()),
                entity.getScore(),
                entity.getPointsAwarded(),
                entity.getCompletedAt());
    }
}
