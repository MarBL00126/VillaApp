package mariano.projects.appVillaSanMartin.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import mariano.projects.appVillaSanMartin.models.requests.StandingRequest;
import mariano.projects.appVillaSanMartin.models.responses.StandingResponse;
import mariano.projects.appVillaSanMartin.services.StandingsService;

@RestController
@RequestMapping("/api/standings")
public class StandingsController {
    private final StandingsService standingsService;

    public StandingsController(StandingsService standingsService) {
        this.standingsService = standingsService;
    }

    @GetMapping
    public List<StandingResponse> getStandings(
            @RequestParam(required = false) Integer season,
            @RequestParam(required = false) String zone) {
        return standingsService.getBySeason(season, zone);
    }

    @PostMapping
    public StandingResponse create(@RequestBody StandingRequest request) {
        return standingsService.create(request);
    }

    @PutMapping("/{id}")
    public StandingResponse update(@PathVariable Integer id, @RequestBody StandingRequest request) {
        return standingsService.update(id, request);
    }
}
