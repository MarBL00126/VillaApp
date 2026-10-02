package mariano.projects.appVillaSanMartin.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import mariano.projects.appVillaSanMartin.models.dto.StaffDto;
import mariano.projects.appVillaSanMartin.services.StaffService;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
public class StaffController {
    private final StaffService staffService;

    @GetMapping
    public List<StaffDto> getAll() {
        return staffService.getAll();
    }

    @GetMapping("/team/{teamId}")
    public List<StaffDto> getByTeam(@PathVariable int teamId) {
        return staffService.getByTeam(teamId);
    }
}
