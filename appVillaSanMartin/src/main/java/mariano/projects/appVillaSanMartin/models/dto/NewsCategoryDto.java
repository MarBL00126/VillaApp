package mariano.projects.appVillaSanMartin.models.dto;

import mariano.projects.appVillaSanMartin.entities.NewsCategoryEntity;

public record NewsCategoryDto(Integer id, String name, String slug) {

    public static NewsCategoryDto from(NewsCategoryEntity entity) {
        if (entity == null) {
            return null;
        }
        return new NewsCategoryDto(entity.getId(), entity.getName(), entity.getSlug());
    }
}
