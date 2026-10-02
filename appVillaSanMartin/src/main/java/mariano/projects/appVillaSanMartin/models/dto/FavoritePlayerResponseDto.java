package mariano.projects.appVillaSanMartin.models.dto;

import mariano.projects.appVillaSanMartin.entities.UserPreferencesEntity;

public record FavoritePlayerResponseDto(Integer favoritePlayerId) {

    public static FavoritePlayerResponseDto from(UserPreferencesEntity entity) {
        if (entity == null) {
            return null;
        }
        return new FavoritePlayerResponseDto(entity.getFavoritePlayerId());
    }
}
