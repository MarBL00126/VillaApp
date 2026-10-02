package mariano.projects.appVillaSanMartin.models.dto;

import mariano.projects.appVillaSanMartin.entities.StaffEntity;

public record StaffDto(
        Integer id,
        TeamDto team,
        String name,
        String role,
        String photoUrl,
        String bio,
        boolean active) {

    public static StaffDto from(StaffEntity entity) {
        if (entity == null) {
            return null;
        }
        return new StaffDto(
                entity.getId(),
                TeamDto.from(entity.getTeam()),
                entity.getName(),
                entity.getRole(),
                entity.getPhotoUrl(),
                entity.getBio(),
                Boolean.TRUE.equals(entity.getActive()));
    }
}
