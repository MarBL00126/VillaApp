package mariano.projects.appVillaSanMartin.models.dto;

import mariano.projects.appVillaSanMartin.entities.PhotoEntity;

public record PhotoDto(Integer id, String imageUrl, String caption, Integer sortOrder) {

    public static PhotoDto from(PhotoEntity entity) {
        if (entity == null) {
            return null;
        }
        return new PhotoDto(entity.getId(), entity.getImageUrl(), entity.getCaption(), entity.getSortOrder());
    }
}
