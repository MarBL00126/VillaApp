package mariano.projects.appVillaSanMartin.models.dto;

import java.util.List;

import mariano.projects.appVillaSanMartin.entities.PollEntity;

public record PollDetailDto(PollDto poll, List<PollOptionDto> options) {

    public static PollDetailDto from(PollEntity entity, List<PollOptionDto> options) {
        return new PollDetailDto(PollDto.from(entity), options == null ? List.of() : List.copyOf(options));
    }
}
