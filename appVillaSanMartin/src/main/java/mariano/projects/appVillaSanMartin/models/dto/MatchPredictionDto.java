package mariano.projects.appVillaSanMartin.models.dto;

import java.time.LocalDateTime;

import mariano.projects.appVillaSanMartin.entities.MatchPredictionEntity;

public record MatchPredictionDto(
        Integer id,
        UserSummaryDto user,
        MatchDto match,
        Integer predictedHomeScore,
        Integer predictedAwayScore,
        Integer pointsAwarded,
        LocalDateTime createdAt) {

    public static MatchPredictionDto from(MatchPredictionEntity entity) {
        if (entity == null) {
            return null;
        }
        return new MatchPredictionDto(
                entity.getId(),
                UserSummaryDto.from(entity.getUser()),
                MatchDto.from(entity.getMatch()),
                entity.getPredictedHomeScore(),
                entity.getPredictedAwayScore(),
                entity.getPointsAwarded(),
                entity.getCreatedAt());
    }
}
