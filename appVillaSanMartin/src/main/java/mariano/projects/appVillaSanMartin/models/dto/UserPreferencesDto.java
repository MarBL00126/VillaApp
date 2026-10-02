package mariano.projects.appVillaSanMartin.models.dto;

import mariano.projects.appVillaSanMartin.entities.UserPreferencesEntity;

public record UserPreferencesDto(
        Integer id,
        Integer favoritePlayerId,
        PlayerDto favoritePlayer,
        Boolean notifyNews,
        Boolean notifyVideos,
        Boolean notifyFees,
        Boolean notifyBenefits,
        Boolean notifyMatchResults) {

    public static UserPreferencesDto from(UserPreferencesEntity entity) {
        if (entity == null) {
            return null;
        }
        return new UserPreferencesDto(
                entity.getId(),
                entity.getFavoritePlayerId(),
                PlayerDto.from(entity.getFavoritePlayer()),
                entity.getNotifyNews(),
                entity.getNotifyVideos(),
                entity.getNotifyFees(),
                entity.getNotifyBenefits(),
                entity.getNotifyMatchResults());
    }
}
