package mariano.projects.appVillaSanMartin.models.dto;

import java.util.List;

import mariano.projects.appVillaSanMartin.entities.TriviaQuestionEntity;

public record TriviaQuestionDto(
        Integer id,
        String question,
        Integer sortOrder,
        List<TriviaOptionDto> options) {

    public static TriviaQuestionDto from(TriviaQuestionEntity entity, List<TriviaOptionDto> options) {
        if (entity == null) {
            return null;
        }
        return new TriviaQuestionDto(
                entity.getId(),
                entity.getQuestion(),
                entity.getSortOrder(),
                options == null ? List.of() : List.copyOf(options));
    }
}
