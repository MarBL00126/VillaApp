package mariano.projects.appVillaSanMartin.models.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import mariano.projects.appVillaSanMartin.entities.TicketTypeEntity;

public record TicketTypeDto(
        int id,
        MatchDto match,
        String name,
        BigDecimal price,
        int totalQuantity,
        int availableQuantity,
        LocalDateTime createdAt) {

    public static TicketTypeDto from(TicketTypeEntity e) {
        if (e == null) {
            return null;
        }
        return new TicketTypeDto(
                e.getId(),
                MatchDto.from(e.getMatch()),
                e.getName(),
                e.getPrice(),
                e.getTotalQuantity(),
                e.getAvailableQuantity(),
                e.getCreatedAt());
    }
}
