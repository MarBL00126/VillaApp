package mariano.projects.appVillaSanMartin.models.dto;

import mariano.projects.appVillaSanMartin.entities.PollOptionEntity;

public record PollOptionDto(
        Integer id,
        String text,
        PlayerDto player,
        Long votes) {

    public static PollOptionDto from(PollOptionEntity entity) {
        return from(entity, null);
    }

    public static PollOptionDto from(PollOptionEntity entity, Long votes) {
        if (entity == null) {
            return null;
        }
        return new PollOptionDto(entity.getId(), entity.getText(), PlayerDto.from(entity.getPlayer()), votes);
    }
}
