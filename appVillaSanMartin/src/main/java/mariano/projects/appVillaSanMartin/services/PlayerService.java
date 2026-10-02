package mariano.projects.appVillaSanMartin.services;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import mariano.projects.appVillaSanMartin.models.dto.PlayerDto;
import mariano.projects.appVillaSanMartin.repositories.PlayerRepository;

@Service
public class PlayerService {
    private final PlayerRepository playerRepository;

    public PlayerService(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "players-page", key = "#pageable.pageNumber + ':' + #pageable.pageSize")
    public Page<PlayerDto> getAll(Pageable pageable) {
        return playerRepository.findByActiveTrue(pageable).map(PlayerDto::from);
    }

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "player-by-id", key = "#id")
    public PlayerDto getById(int id) {
        return playerRepository.findByIdAndActiveTrue(id)
                .map(PlayerDto::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Player not found"));
    }

    @Transactional(readOnly = true)
    @Cacheable(
            cacheNames = "players-by-team-page",
            key = "#teamId + ':' + #pageable.pageNumber + ':' + #pageable.pageSize")
    public Page<PlayerDto> getByTeam(int teamId, Pageable pageable) {
        return playerRepository.findByTeam_IdAndActiveTrue(teamId, pageable).map(PlayerDto::from);
    }
}
