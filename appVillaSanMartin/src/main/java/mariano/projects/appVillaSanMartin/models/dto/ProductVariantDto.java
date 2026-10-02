package mariano.projects.appVillaSanMartin.models.dto;

import mariano.projects.appVillaSanMartin.entities.ProductVariantEntity;

public record ProductVariantDto(
        int id,
        ProductDto product,
        String label,
        Integer stock) {

    public static ProductVariantDto from(ProductVariantEntity e) {
        if (e == null) return null;
        return new ProductVariantDto(
                e.getId(),
                ProductDto.from(e.getProduct()),
                e.getLabel(),
                e.getStock());
    }
}
