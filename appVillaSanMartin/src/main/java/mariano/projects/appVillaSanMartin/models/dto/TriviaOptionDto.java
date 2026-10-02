package mariano.projects.appVillaSanMartin.models.dto;

import mariano.projects.appVillaSanMartin.entities.TriviaOptionEntity;

public record TriviaOptionDto(Integer id, String text) {

    public static TriviaOptionDto from(TriviaOptionEntity entity) {
        if (entity == null) {
            return null;
        }
        return new TriviaOptionDto(entity.getId(), entity.getText());
    }
}
