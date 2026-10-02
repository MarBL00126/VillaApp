package mariano.projects.appVillaSanMartin.models.dto;

import mariano.projects.appVillaSanMartin.entities.BadgeEntity;

public record BadgeDto(
        int id,
        String name,
        String description,
        String imageUrl,
        int requiredPoints,
        Boolean active) {

    public static BadgeDto from(BadgeEntity e) {
        if (e == null) {
            return null;
        }
        return new BadgeDto(
                e.getId(),
                e.getName(),
                e.getDescription(),
                e.getImageUrl(),
                e.getRequiredPoints(),
                e.getActive());
    }
}
