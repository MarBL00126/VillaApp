package mariano.projects.appVillaSanMartin.models.dto;

import mariano.projects.appVillaSanMartin.entities.TeamEntity;

public record ClubInfoDto(
        int id,
        String name,
        String city,
        String shortName,
        String stadium,
        String category,
        String logoUrl,
        int foundedYear,
        String history,
        String description) {

    private static final int DEFAULT_FOUNDED_YEAR = 1936;
    private static final String DEFAULT_HISTORY =
            "Club Villa San Martín, una institución deportiva y social de Resistencia.";
    private static final String DEFAULT_DESCRIPTION =
            "Perfil institucional del club, plantel y cuerpo técnico.";

    public static ClubInfoDto from(TeamEntity entity) {
        if (entity == null) {
            return null;
        }
        return new ClubInfoDto(
                entity.getId(),
                entity.getName(),
                entity.getCity(),
                entity.getShortName(),
                entity.getStadium(),
                entity.getCategory(),
                entity.getLogoUrl(),
                DEFAULT_FOUNDED_YEAR,
                DEFAULT_HISTORY,
                DEFAULT_DESCRIPTION);
    }
}
