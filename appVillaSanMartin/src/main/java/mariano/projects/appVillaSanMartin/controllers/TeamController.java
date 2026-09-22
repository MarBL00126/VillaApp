package mariano.projects.appVillaSanMartin.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mariano.projects.appVillaSanMartin.entities.TeamEntity;
import mariano.projects.appVillaSanMartin.entities.StaffEntity;
import mariano.projects.appVillaSanMartin.services.TeamService;
import mariano.projects.appVillaSanMartin.services.StaffService;

@RestController
@RequestMapping({"/api/teams", "/api/team"})
public class TeamController {
    private final TeamService teamService;
    private final StaffService staffService;

    public TeamController(TeamService teamService, StaffService staffService) {
        this.teamService = teamService;
        this.staffService = staffService;
    }

    @GetMapping
    public List<TeamEntity> getAll() {
        return teamService.getAll();
    }

    @GetMapping("/{id}")
    public TeamEntity getById(@PathVariable int id) {
        return teamService.getById(id);
    }

    @GetMapping("/info")
    public Map<String, Object> getInfo() {
        TeamEntity team = teamService.getPrimaryTeam();
        return Map.of(
                "id", team.getId(),
                "name", team.getName(),
                "city", team.getCity(),
                "shortName", team.getShortName(),
                "stadium", team.getStadium(),
                "category", team.getCategory(),
                "logoUrl", team.getLogoUrl(),
                "foundedYear", 1936,
                "history", "Club Villa San Martín, una institución deportiva y social de Resistencia.",
                "description", "Perfil institucional del club, plantel y cuerpo técnico."
        );
    }

    @GetMapping("/staff")
    public List<StaffEntity> getStaff() {
        return staffService.getAll();
    }
}
