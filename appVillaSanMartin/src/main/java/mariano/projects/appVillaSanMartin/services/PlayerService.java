package mariano.projects.appVillaSanMartin.services;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import mariano.projects.appVillaSanMartin.entities.PlayerEntity;
import mariano.projects.appVillaSanMartin.repositories.PlayerRepository;

@Service
public class PlayerService {
    private final PlayerRepository playerRepository;

    public PlayerService(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    public List<PlayerEntity> getAll() {
        return playerRepository.findByActiveTrue();
    }

    public PlayerEntity getById(int id) {
        PlayerEntity player = playerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Player not found"));
        if (!player.isActive()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Player not found");
        }
        return player;
    }

    public List<PlayerEntity> getByTeam(int teamId) {
        return playerRepository.findByTeam_IdAndActiveTrue(teamId);
    }
}
