package mariano.projects.appVillaSanMartin.models.dto;

import mariano.projects.appVillaSanMartin.entities.UserEntity;

// Vista mínima de un usuario anidado en otras respuestas (sin email, teléfono ni rol).
public record UserSummaryDto(int id, String name, String surname) {

    public static UserSummaryDto from(UserEntity e) {
        if (e == null) return null;
        return new UserSummaryDto(e.getId(), e.getName(), e.getSurname());
    }
}
