package mariano.projects.appVillaSanMartin.models.dto;

import java.time.LocalDateTime;

import mariano.projects.appVillaSanMartin.entities.RewardRedemptionEntity;

public record RewardRedemptionDto(
        int id,
        UserSummaryDto user,
        RewardDto reward,
        String code,
        LocalDateTime redeemedAt,
        LocalDateTime usedAt,
        LocalDateTime expiresAt) {

    public static RewardRedemptionDto from(RewardRedemptionEntity e) {
        if (e == null) {
            return null;
        }
        return new RewardRedemptionDto(
                e.getId(),
                UserSummaryDto.from(e.getUser()),
                RewardDto.from(e.getReward()),
                e.getCode(),
                e.getRedeemedAt(),
                e.getUsedAt(),
                e.getExpiresAt());
    }
}
