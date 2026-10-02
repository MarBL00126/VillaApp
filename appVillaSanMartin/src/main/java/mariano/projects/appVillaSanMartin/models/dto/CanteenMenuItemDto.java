package mariano.projects.appVillaSanMartin.models.dto;

import java.math.BigDecimal;

import mariano.projects.appVillaSanMartin.entities.CanteenMenuItemEntity;

public record CanteenMenuItemDto(
        int id,
        CanteenMenuCategoryDto category,
        String name,
        String description,
        BigDecimal price,
        String imageUrl,
        boolean available) {

    public static CanteenMenuItemDto from(CanteenMenuItemEntity e) {
        if (e == null) return null;
        return new CanteenMenuItemDto(
                e.getId(),
                CanteenMenuCategoryDto.from(e.getCategory()),
                e.getName(),
                e.getDescription(),
                e.getPrice(),
                e.getImageUrl(),
                Boolean.TRUE.equals(e.getAvailable()));
    }
}
