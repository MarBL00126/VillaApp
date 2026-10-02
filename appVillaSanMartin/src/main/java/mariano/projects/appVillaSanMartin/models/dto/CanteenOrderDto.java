package mariano.projects.appVillaSanMartin.models.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import mariano.projects.appVillaSanMartin.entities.CanteenOrderEntity;

public record CanteenOrderDto(
        int id,
        UserSummaryDto user,
        String orderNumber,
        String status,
        BigDecimal totalAmount,
        String paymentMethod,
        LocalDateTime createdAt,
        LocalDateTime readyAt,
        List<CanteenOrderItemDto> items) {

    public static CanteenOrderDto from(CanteenOrderEntity e) {
        if (e == null) return null;
        List<CanteenOrderItemDto> items = e.getItems() == null
                ? List.of()
                : e.getItems().stream().map(CanteenOrderItemDto::from).toList();
        return new CanteenOrderDto(
                e.getId(),
                UserSummaryDto.from(e.getUser()),
                e.getOrderNumber(),
                e.getStatus(),
                e.getTotalAmount(),
                e.getPaymentMethod(),
                e.getCreatedAt(),
                e.getReadyAt(),
                items);
    }
}
