package mariano.projects.appVillaSanMartin.models.dto;

import java.math.BigDecimal;

import mariano.projects.appVillaSanMartin.entities.ShopOrderItemEntity;

public record ShopOrderItemDto(
        int id,
        ProductDto product,
        ProductVariantDto variant,
        Integer quantity,
        BigDecimal unitPrice) {

    public static ShopOrderItemDto from(ShopOrderItemEntity e) {
        if (e == null) return null;
        return new ShopOrderItemDto(
                e.getId(),
                ProductDto.from(e.getProduct()),
                ProductVariantDto.from(e.getVariant()),
                e.getQuantity(),
                e.getUnitPrice());
    }
}
