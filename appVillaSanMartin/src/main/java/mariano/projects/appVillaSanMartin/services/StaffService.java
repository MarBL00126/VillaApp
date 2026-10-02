package mariano.projects.appVillaSanMartin.services;

import java.util.List;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import mariano.projects.appVillaSanMartin.models.dto.StaffDto;
import mariano.projects.appVillaSanMartin.repositories.StaffRepository;

@Service
@RequiredArgsConstructor
public class StaffService {
    private final StaffRepository staffRepository;

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "staff-all")
    public List<StaffDto> getAll() {
        return staffRepository.findByActiveTrue().stream()
                .map(StaffDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "staff-by-team", key = "#teamId")
    public List<StaffDto> getByTeam(int teamId) {
        return staffRepository.findByTeam_IdAndActiveTrue(teamId).stream()
                .map(StaffDto::from)
                .toList();
    }
}
