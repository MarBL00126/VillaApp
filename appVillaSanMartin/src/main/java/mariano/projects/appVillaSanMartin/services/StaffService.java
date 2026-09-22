package mariano.projects.appVillaSanMartin.services;
import mariano.projects.appVillaSanMartin.entities.StaffEntity;
import mariano.projects.appVillaSanMartin.repositories.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
@RequiredArgsConstructor
public class StaffService {
    private final StaffRepository staffRepository;
    public List<StaffEntity> getAll() { return staffRepository.findByActiveTrue(); }
    public List<StaffEntity> getByTeam(int teamId) { return staffRepository.findByTeam_IdAndActiveTrue(teamId); }
}
