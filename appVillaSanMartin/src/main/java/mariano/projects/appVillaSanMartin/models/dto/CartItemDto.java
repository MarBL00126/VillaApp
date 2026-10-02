package mariano.projects.appVillaSanMartin.models.dto;

import java.math.BigDecimal;

import mariano.projects.appVillaSanMartin.entities.CartItemEntity;

public record CartItemDto(
        int id,
        ProductDto product,
        ProductVariantDto variant,
        Integer quantity,
        BigDecimal unitPrice) {

    public static CartItemDto from(CartItemEntity e) {
        if (e == null) return null;
        return new CartItemDto(
                e.getId(),
                ProductDto.from(e.getProduct()),
                ProductVariantDto.from(e.getVariant()),
                e.getQuantity(),
                e.getUnitPrice());
    }
}
