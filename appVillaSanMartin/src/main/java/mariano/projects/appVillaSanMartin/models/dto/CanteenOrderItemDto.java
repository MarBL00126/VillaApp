package mariano.projects.appVillaSanMartin.models.dto;

import java.math.BigDecimal;

import mariano.projects.appVillaSanMartin.entities.CanteenOrderItemEntity;

public record CanteenOrderItemDto(
        int id,
        CanteenMenuItemDto menuItem,
        Integer quantity,
        BigDecimal unitPrice) {

    public static CanteenOrderItemDto from(CanteenOrderItemEntity e) {
        if (e == null) return null;
        return new CanteenOrderItemDto(
                e.getId(),
                CanteenMenuItemDto.from(e.getMenuItem()),
                e.getQuantity(),
                e.getUnitPrice());
    }
}
