package mariano.projects.appVillaSanMartin.models.dto;

import mariano.projects.appVillaSanMartin.entities.PointsAccountEntity;

public record PointsAccountDto(
        int id,
        UserSummaryDto user,
        int totalPoints,
        String level) {

    public static PointsAccountDto from(PointsAccountEntity e) {
        if (e == null) {
            return null;
        }
        return new PointsAccountDto(
                e.getId(),
                UserSummaryDto.from(e.getUser()),
                e.getTotalPoints(),
                e.getLevel());
    }
}
