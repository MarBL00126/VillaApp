package mariano.projects.appVillaSanMartin.models.dto;

import java.time.LocalDateTime;

import mariano.projects.appVillaSanMartin.entities.MatchEntity;

// El frontend lee "isLocal" (types/index.ts).
public record MatchDto(
        int id,
        LocalDateTime matchDate,
        boolean isLocal,
        String opponent,
        int teamPoints,
        int opponentPoints,
        TeamDto team) {

    public static MatchDto from(MatchEntity e) {
        if (e == null) return null;
        return new MatchDto(e.getId(), e.getMatchDate(), e.isLocal(), e.getOpponent(), e.getTeamPoints(),
                e.getOpponentPoints(), TeamDto.from(e.getTeam()));
    }
}
