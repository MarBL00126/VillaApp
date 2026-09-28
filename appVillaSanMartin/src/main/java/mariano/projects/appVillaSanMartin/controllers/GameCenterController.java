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

import mariano.projects.appVillaSanMartin.models.requests.CreatePlayRequest;
import mariano.projects.appVillaSanMartin.models.requests.CreateShotRequest;
import mariano.projects.appVillaSanMartin.models.requests.UpdateBoxScoreRequest;
import mariano.projects.appVillaSanMartin.models.requests.UpdateLiveMatchStateRequest;
import mariano.projects.appVillaSanMartin.models.responses.BoxScoreResponse;
import mariano.projects.appVillaSanMartin.models.responses.GameLeadersResponse;
import mariano.projects.appVillaSanMartin.models.responses.LiveMatchStateResponse;
import mariano.projects.appVillaSanMartin.models.responses.PlayByPlayResponse;
import mariano.projects.appVillaSanMartin.models.responses.ShotChartResponse;
import mariano.projects.appVillaSanMartin.services.BoxScoreService;
import mariano.projects.appVillaSanMartin.services.GameCenterService;
import mariano.projects.appVillaSanMartin.services.ShotChartService;

@RestController
@RequestMapping("/api/game-center")
public class GameCenterController {
    private final GameCenterService gameCenterService;
    private final BoxScoreService boxScoreService;
    private final ShotChartService shotChartService;

    public GameCenterController(
            GameCenterService gameCenterService,
            BoxScoreService boxScoreService,
            ShotChartService shotChartService) {
        this.gameCenterService = gameCenterService;
        this.boxScoreService = boxScoreService;
        this.shotChartService = shotChartService;
    }

    @GetMapping("/{matchId}")
    public LiveMatchStateResponse getState(@PathVariable Integer matchId) {
        return gameCenterService.getState(matchId);
    }

    @GetMapping("/{matchId}/plays")
    public List<PlayByPlayResponse> getPlays(
            @PathVariable Integer matchId,
            @RequestParam(required = false) Integer quarter) {
        return gameCenterService.getPlays(matchId, quarter);
    }

    @GetMapping("/{matchId}/box-score")
    public List<BoxScoreResponse> getBoxScore(@PathVariable Integer matchId) {
        return boxScoreService.getByMatch(matchId);
    }

    @GetMapping("/{matchId}/box-score/{playerId}")
    public BoxScoreResponse getPlayerBoxScore(@PathVariable Integer matchId, @PathVariable Integer playerId) {
        return boxScoreService.getByMatchAndPlayer(matchId, playerId);
    }

    @GetMapping("/{matchId}/leaders")
    public GameLeadersResponse getLeaders(@PathVariable Integer matchId) {
        return gameCenterService.getLeaders(matchId);
    }

    @GetMapping("/{matchId}/shot-chart/{playerId}")
    public List<ShotChartResponse> getShotChart(@PathVariable Integer matchId, @PathVariable Integer playerId) {
        return shotChartService.getByMatchAndPlayer(matchId, playerId);
    }

    @PutMapping("/{matchId}/state")
    public LiveMatchStateResponse updateState(
            @PathVariable Integer matchId,
            @RequestBody UpdateLiveMatchStateRequest request) {
        return gameCenterService.updateState(matchId, request);
    }

    @PostMapping("/{matchId}/plays")
    public PlayByPlayResponse createPlay(@PathVariable Integer matchId, @RequestBody CreatePlayRequest request) {
        return gameCenterService.createPlay(matchId, request);
    }

    @PutMapping("/{matchId}/box-score/{playerId}")
    public BoxScoreResponse updateBoxScore(
            @PathVariable Integer matchId,
            @PathVariable Integer playerId,
            @RequestBody UpdateBoxScoreRequest request) {
        return boxScoreService.upsert(matchId, playerId, request);
    }

    @PostMapping("/{matchId}/shot-chart")
    public ShotChartResponse createShot(@PathVariable Integer matchId, @RequestBody CreateShotRequest request) {
        return shotChartService.create(matchId, request);
    }
}
