package mariano.projects.appVillaSanMartin.models.dto;

import java.time.LocalDateTime;

import mariano.projects.appVillaSanMartin.entities.ReservationEntity;
import mariano.projects.appVillaSanMartin.entities.ReservationStatus;

public record ReservationSummaryDto(
        int id,
        int quantity,
        ReservationStatus status,
        LocalDateTime expiresAt) {

    public static ReservationSummaryDto from(ReservationEntity e) {
        if (e == null) {
            return null;
        }
        return new ReservationSummaryDto(
                e.getId(),
                e.getQuantity(),
                e.getStatus(),
                e.getExpiresAt());
    }
}
