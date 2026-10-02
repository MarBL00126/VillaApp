package mariano.projects.appVillaSanMartin.models.dto;

import java.time.LocalDate;

import mariano.projects.appVillaSanMartin.entities.GalleryEntity;

public record GalleryDto(Integer id, String title, String coverImageUrl, LocalDate eventDate) {

    public static GalleryDto from(GalleryEntity entity) {
        if (entity == null) {
            return null;
        }
        return new GalleryDto(entity.getId(), entity.getTitle(), entity.getCoverImageUrl(), entity.getEventDate());
    }
}
