package mariano.projects.appVillaSanMartin.models.dto;

import mariano.projects.appVillaSanMartin.entities.AppConfigEntity;

public record AppConfigDto(Integer id, String key, String value, String type, String description) {

    public static AppConfigDto from(AppConfigEntity e) {
        if (e == null) return null;
        return new AppConfigDto(e.getId(), e.getKey(), e.getValue(), e.getType(), e.getDescription());
    }
}
