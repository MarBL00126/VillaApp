package mariano.projects.appVillaSanMartin.models.dto;

import mariano.projects.appVillaSanMartin.entities.PlayerStatsEntity;

public record PlayerStatsDto(
        int id,
        PlayerDto player,
        float playedGames,
        float totalMinutes,
        float totalPoints,
        float madeFreeThrows,
        float attemptedFreeThrows,
        float madeTwoPointers,
        float attemptedTwoPointers,
        float madeThreePointers,
        float attemptedThreePointers,
        float totalRebounds,
        float totalAssists,
        float totalBlocks,
        float totalTurnovers,
        float totalSteals,
        float totalFouls,
        float totalValoration) {

    public static PlayerStatsDto from(PlayerStatsEntity entity) {
        if (entity == null) {
            return null;
        }
        return new PlayerStatsDto(
                entity.getId(),
                PlayerDto.from(entity.getPlayer()),
                entity.getPlayedGames(),
                entity.getTotalMinutes(),
                entity.getTotalPoints(),
                entity.getMadeFreeThrows(),
                entity.getAttemptedFreeThrows(),
                entity.getMadeTwoPointers(),
                entity.getAttemptedTwoPointers(),
                entity.getMadeThreePointers(),
                entity.getAttemptedThreePointers(),
                entity.getTotalRebounds(),
                entity.getTotalAssists(),
                entity.getTotalBlocks(),
                entity.getTotalTurnovers(),
                entity.getTotalSteals(),
                entity.getTotalFouls(),
                entity.getTotalValoration());
    }
}
