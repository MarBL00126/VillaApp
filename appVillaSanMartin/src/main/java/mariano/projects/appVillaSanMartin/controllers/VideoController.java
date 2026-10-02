package mariano.projects.appVillaSanMartin.controllers;

import java.util.List;

import mariano.projects.appVillaSanMartin.models.dto.PageResponses;
import mariano.projects.appVillaSanMartin.models.dto.VideoDto;
import mariano.projects.appVillaSanMartin.services.VideoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/videos")
public class VideoController {
    private final VideoService videoService;

    public VideoController(VideoService videoService) {
        this.videoService = videoService;
    }

    @GetMapping({"", "/"})
    public ResponseEntity<List<VideoDto>> getAll(@RequestParam(defaultValue = "0") int page,
                                                 @RequestParam(defaultValue = "20") int size) {
        return PageResponses.of(videoService.getAll(PageResponses.pageable(page, size)));
    }

    @GetMapping("/{id}")
    public VideoDto getById(@PathVariable int id) { return videoService.getById(id); }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<VideoDto>> getByType(@PathVariable String type,
                                                    @RequestParam(defaultValue = "0") int page,
                                                    @RequestParam(defaultValue = "20") int size) {
        return PageResponses.of(videoService.getByType(type, PageResponses.pageable(page, size)));
    }
}
