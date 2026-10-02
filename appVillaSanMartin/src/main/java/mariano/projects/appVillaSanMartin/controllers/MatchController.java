package mariano.projects.appVillaSanMartin.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mariano.projects.appVillaSanMartin.models.dto.MatchDto;
import mariano.projects.appVillaSanMartin.models.dto.TicketTypeDto;
import mariano.projects.appVillaSanMartin.services.MatchService;
import mariano.projects.appVillaSanMartin.services.TicketTypeService;

@RestController
@RequestMapping("/api")
public class MatchController {
    private final MatchService matchService;
    private final TicketTypeService ticketTypeService;

    public MatchController(MatchService matchService, TicketTypeService ticketTypeService) {
        this.matchService = matchService;
        this.ticketTypeService = ticketTypeService;
    }

    @GetMapping("/matches/{id}/ticket-types")
    public List<TicketTypeDto> getAllTicketTypes(@PathVariable int id) {
        return ticketTypeService.getByMatchId(id);
    }

    @GetMapping("/matches")
    public List<MatchDto> getAll() {
        return matchService.getAll();
    }

    @GetMapping("/matches/{id}")
    public MatchDto getById(@PathVariable int id) {
        return matchService.getById(id);
    }

    @GetMapping("/fixture")
    public List<MatchDto> getFixture() {
        return matchService.getFixture();
    }
}
