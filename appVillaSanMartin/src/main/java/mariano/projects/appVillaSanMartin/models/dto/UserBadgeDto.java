package mariano.projects.appVillaSanMartin.models.dto;

import java.time.LocalDateTime;

import mariano.projects.appVillaSanMartin.entities.UserBadgeEntity;

public record UserBadgeDto(
        int id,
        UserSummaryDto user,
        BadgeDto badge,
        LocalDateTime earnedAt) {

    public static UserBadgeDto from(UserBadgeEntity e) {
        if (e == null) {
            return null;
        }
        return new UserBadgeDto(
                e.getId(),
                UserSummaryDto.from(e.getUser()),
                BadgeDto.from(e.getBadge()),
                e.getEarnedAt());
    }
}
