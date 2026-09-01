package mariano.projects.appVillaSanMartin.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import mariano.projects.appVillaSanMartin.entities.MatchEntity;
import mariano.projects.appVillaSanMartin.entities.TicketTypeEntity;
import mariano.projects.appVillaSanMartin.services.MatchService;
import mariano.projects.appVillaSanMartin.services.TicketTypeService;

@RestController
public class MatchController {
    private final MatchService matchService;
    private final TicketTypeService ticketTypeService;

    public MatchController(MatchService matchService, TicketTypeService ticketTypeService) {
        this.matchService = matchService;
        this.ticketTypeService = ticketTypeService;
    }

    @GetMapping("/matches/{id}/ticket-types")
    public List<TicketTypeEntity> getAllTicketTypes(@PathVariable int id) {
        return ticketTypeService.getByMatchId(id);
    }

    @GetMapping("/matches")
    public List<MatchEntity> getAll() {
        return matchService.getAll();
    }

    @GetMapping("/matches/{id}")
    public MatchEntity getById(@PathVariable int id) {
        return matchService.getById(id);
    }

    @GetMapping("/fixture")
    public List<MatchEntity> getFixture() {
        return matchService.getFixture();
    }
}
