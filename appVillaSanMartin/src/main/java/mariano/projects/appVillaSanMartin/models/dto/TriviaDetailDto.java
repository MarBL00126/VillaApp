package mariano.projects.appVillaSanMartin.models.dto;

import java.util.List;

import mariano.projects.appVillaSanMartin.entities.TriviaEntity;

public record TriviaDetailDto(TriviaDto trivia, List<TriviaQuestionDto> questions) {

    public static TriviaDetailDto from(TriviaEntity entity, List<TriviaQuestionDto> questions) {
        return new TriviaDetailDto(TriviaDto.from(entity), questions == null ? List.of() : List.copyOf(questions));
    }
}
