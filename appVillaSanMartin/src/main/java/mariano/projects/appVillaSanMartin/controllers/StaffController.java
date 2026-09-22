package mariano.projects.appVillaSanMartin.controllers;
import mariano.projects.appVillaSanMartin.entities.StaffEntity;
import mariano.projects.appVillaSanMartin.services.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
public class StaffController {
    private final StaffService staffService;
    @GetMapping
    public List<StaffEntity> getAll() {
        return staffService.getAll();
    }
    @GetMapping("/team/{teamId}")
    public List<StaffEntity> getByTeam(@PathVariable int teamId) {
        return staffService.getByTeam(teamId);
    }
}
