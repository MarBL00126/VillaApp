package mariano.projects.appVillaSanMartin.controllers;
import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.services.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/videos")
public class VideoController {
    private final VideoService videoService;

    public VideoController(VideoService videoService) {
        this.videoService = videoService;
    }

    @GetMapping({"", "/"})
    public List<VideoEntity> getAll() { return videoService.getAll(); }

    @GetMapping("/{id}")
    public VideoEntity getById(@PathVariable int id) { return videoService.getById(id); }

    @GetMapping("/type/{type}")
    public List<VideoEntity> getByType(@PathVariable String type) { return videoService.getByType(type); }
}
