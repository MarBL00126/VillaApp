package mariano.projects.appVillaSanMartin.models.dto;

import java.math.BigDecimal;

import mariano.projects.appVillaSanMartin.entities.PurchaseOrderEntity;
import mariano.projects.appVillaSanMartin.entities.PurchaseOrderStatus;

public record PurchaseOrderDto(
        int id,
        UserSummaryDto user,
        TicketTypeDto ticketType,
        ReservationSummaryDto reservation,
        int quantity,
        BigDecimal unitPrice,
        BigDecimal totalAmount,
        PurchaseOrderStatus status,
        String entryCode,
        String qrData) {

    public static PurchaseOrderDto from(PurchaseOrderEntity e) {
        if (e == null) {
            return null;
        }
        return new PurchaseOrderDto(
                e.getId(),
                UserSummaryDto.from(e.getUser()),
                TicketTypeDto.from(e.getTicketType()),
                ReservationSummaryDto.from(e.getReservation()),
                e.getQuantity(),
                e.getUnitPrice(),
                e.getTotalAmount(),
                e.getStatus(),
                e.getEntryCode(),
                e.getQrData());
    }
}
