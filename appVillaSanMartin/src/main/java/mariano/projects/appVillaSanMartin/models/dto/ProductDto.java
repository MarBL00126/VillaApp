package mariano.projects.appVillaSanMartin.models.dto;

import java.math.BigDecimal;

import mariano.projects.appVillaSanMartin.entities.ProductEntity;

public record ProductDto(
        int id,
        ProductCategoryDto category,
        String name,
        String description,
        BigDecimal price,
        String imageUrl,
        boolean active) {

    public static ProductDto from(ProductEntity e) {
        if (e == null) return null;
        return new ProductDto(
                e.getId(),
                ProductCategoryDto.from(e.getCategory()),
                e.getName(),
                e.getDescription(),
                e.getPrice(),
                e.getImageUrl(),
                Boolean.TRUE.equals(e.getActive()));
    }
}
