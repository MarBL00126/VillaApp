package mariano.projects.appVillaSanMartin.models.dto;

import mariano.projects.appVillaSanMartin.entities.CanteenMenuCategoryEntity;

public record CanteenMenuCategoryDto(
        int id,
        String name,
        Integer sortOrder) {

    public static CanteenMenuCategoryDto from(CanteenMenuCategoryEntity e) {
        if (e == null) return null;
        return new CanteenMenuCategoryDto(e.getId(), e.getName(), e.getSortOrder());
    }
}
