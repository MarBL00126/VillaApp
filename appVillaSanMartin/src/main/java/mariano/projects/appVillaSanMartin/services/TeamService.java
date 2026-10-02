package mariano.projects.appVillaSanMartin.services;

import java.util.List;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import mariano.projects.appVillaSanMartin.models.dto.ClubInfoDto;
import mariano.projects.appVillaSanMartin.models.dto.TeamDto;
import mariano.projects.appVillaSanMartin.repositories.TeamRepository;

@Service
public class TeamService {
    private final TeamRepository teamRepository;

    public TeamService(TeamRepository teamRepository) {
        this.teamRepository = teamRepository;
    }

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "teams-all")
    public List<TeamDto> getAll() {
        return teamRepository.findAll().stream()
                .map(TeamDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "team-by-id", key = "#id")
    public TeamDto getById(int id) {
        return teamRepository.findById(id)
                .map(TeamDto::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found"));
    }

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "club-info")
    public ClubInfoDto getClubInfo() {
        return teamRepository.findByPrimaryTeamTrue()
                .or(() -> teamRepository.findAll().stream().findFirst())
                .map(ClubInfoDto::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found"));
    }
}
