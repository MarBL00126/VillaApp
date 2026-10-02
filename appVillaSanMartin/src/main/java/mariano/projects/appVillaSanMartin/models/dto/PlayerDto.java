package mariano.projects.appVillaSanMartin.models.dto;

import java.time.LocalDate;

import mariano.projects.appVillaSanMartin.entities.PlayerEntity;

public record PlayerDto(
        int id,
        String name,
        String surname,
        String position,
        int shirtNumber,
        float height,
        String nationality,
        LocalDate birthDate,
        TeamDto team,
        String biography,
        String imageUrl,
        boolean active,
        int favoriteCount) {

    public static PlayerDto from(PlayerEntity e) {
        if (e == null) return null;
        return new PlayerDto(e.getId(), e.getName(), e.getSurname(), e.getPosition(), e.getShirtNumber(),
                e.getHeight(), e.getNationality(), e.getBirthDate(), TeamDto.from(e.getTeam()),
                e.getBiography(), e.getImageUrl(), e.isActive(), e.getFavoriteCount());
    }
}
