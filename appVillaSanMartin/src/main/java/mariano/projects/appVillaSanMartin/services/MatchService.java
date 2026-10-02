package mariano.projects.appVillaSanMartin.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import mariano.projects.appVillaSanMartin.models.dto.MatchDto;
import mariano.projects.appVillaSanMartin.repositories.MatchRepository;

@Service
public class MatchService {
    private final MatchRepository matchRepository;

    public MatchService(MatchRepository matchRepository) {
        this.matchRepository = matchRepository;
    }

    @Transactional(readOnly = true)
    public List<MatchDto> getAll() {
        return matchRepository.findAll().stream()
                .map(MatchDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public MatchDto getById(int id) {
        return MatchDto.from(matchRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Match not found")));
    }

    @Transactional(readOnly = true)
    public List<MatchDto> getFixture() {
        return matchRepository.findByMatchDateAfterOrderByMatchDateAsc(LocalDateTime.now()).stream()
                .map(MatchDto::from)
                .toList();
    }
}
