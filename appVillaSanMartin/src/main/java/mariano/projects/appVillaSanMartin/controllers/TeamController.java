package mariano.projects.appVillaSanMartin.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mariano.projects.appVillaSanMartin.models.dto.ClubInfoDto;
import mariano.projects.appVillaSanMartin.models.dto.StaffDto;
import mariano.projects.appVillaSanMartin.models.dto.TeamDto;
import mariano.projects.appVillaSanMartin.services.StaffService;
import mariano.projects.appVillaSanMartin.services.TeamService;

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
    public List<TeamDto> getAll() {
        return teamService.getAll();
    }

    @GetMapping("/{id}")
    public TeamDto getById(@PathVariable int id) {
        return teamService.getById(id);
    }

    @GetMapping("/info")
    public ClubInfoDto getInfo() {
        return teamService.getClubInfo();
    }

    @GetMapping("/staff")
    public List<StaffDto> getStaff() {
        return staffService.getAll();
    }
}
