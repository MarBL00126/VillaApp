package mariano.projects.appVillaSanMartin.models.dto;

import mariano.projects.appVillaSanMartin.entities.ProductCategoryEntity;

public record ProductCategoryDto(
        int id,
        String name,
        String slug,
        boolean active) {

    public static ProductCategoryDto from(ProductCategoryEntity e) {
        if (e == null) return null;
        return new ProductCategoryDto(
                e.getId(),
                e.getName(),
                e.getSlug(),
                Boolean.TRUE.equals(e.getActive()));
    }
}
