package mariano.projects.appVillaSanMartin.models.dto;

import java.time.LocalDateTime;

import mariano.projects.appVillaSanMartin.entities.PointsTransactionEntity;

public record PointsTransactionDto(
        int id,
        PointsAccountDto account,
        int amount,
        String reason,
        Integer referenceId,
        LocalDateTime createdAt) {

    public static PointsTransactionDto from(PointsTransactionEntity e) {
        if (e == null) {
            return null;
        }
        return new PointsTransactionDto(
                e.getId(),
                PointsAccountDto.from(e.getAccount()),
                e.getAmount(),
                e.getReason(),
                e.getReferenceId(),
                e.getCreatedAt());
    }
}
