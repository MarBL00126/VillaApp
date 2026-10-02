package mariano.projects.appVillaSanMartin.models.dto;

import mariano.projects.appVillaSanMartin.entities.TeamEntity;

public record TeamDto(
        int id,
        String name,
        String city,
        String shortName,
        String category,
        String logoUrl,
        String stadium,
        boolean primaryTeam,
        boolean active) {

    public static TeamDto from(TeamEntity e) {
        if (e == null) return null;
        return new TeamDto(e.getId(), e.getName(), e.getCity(), e.getShortName(), e.getCategory(),
                e.getLogoUrl(), e.getStadium(), e.isPrimaryTeam(), e.isActive());
    }
}
