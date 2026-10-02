package mariano.projects.appVillaSanMartin.models.dto;

import java.time.LocalDateTime;

import mariano.projects.appVillaSanMartin.entities.ReservationEntity;
import mariano.projects.appVillaSanMartin.entities.ReservationStatus;

public record ReservationDto(
        int id,
        UserSummaryDto user,
        TicketTypeDto ticketType,
        int quantity,
        ReservationStatus status,
        LocalDateTime expiresAt,
        LocalDateTime createdAt) {

    public static ReservationDto from(ReservationEntity e) {
        if (e == null) {
            return null;
        }
        return new ReservationDto(
                e.getId(),
                UserSummaryDto.from(e.getUser()),
                TicketTypeDto.from(e.getTicketType()),
                e.getQuantity(),
                e.getStatus(),
                e.getExpiresAt(),
                e.getCreatedAt());
    }
}
