package mariano.projects.appVillaSanMartin.models.dto;

import mariano.projects.appVillaSanMartin.entities.RewardEntity;

public record RewardDto(
        int id,
        String name,
        String description,
        int pointsCost,
        String type,
        Integer stock,
        Boolean active) {

    public static RewardDto from(RewardEntity e) {
        if (e == null) {
            return null;
        }
        return new RewardDto(
                e.getId(),
                e.getName(),
                e.getDescription(),
                e.getPointsCost(),
                e.getType(),
                e.getStock(),
                e.getActive());
    }
}
