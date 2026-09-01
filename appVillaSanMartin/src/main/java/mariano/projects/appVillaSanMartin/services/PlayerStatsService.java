package mariano.projects.appVillaSanMartin.services;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import mariano.projects.appVillaSanMartin.entities.PlayerStatsEntity;
import mariano.projects.appVillaSanMartin.repositories.PlayerStatsRepository;

@Service
public class PlayerStatsService {
    private final PlayerStatsRepository playerStatsRepository;

    public PlayerStatsService(PlayerStatsRepository playerStatsRepository) {
        this.playerStatsRepository = playerStatsRepository;
    }

    public List<PlayerStatsEntity> getAll() {
        return playerStatsRepository.findAll();
    }

    public PlayerStatsEntity getByPlayerId(int playerId) {
        return playerStatsRepository.findByPlayer_Id(playerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Stats not found for player"));
    }
}
