package mariano.projects.appVillaSanMartin.controllers;
import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.services.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/galleries")
public class GalleryController {
    private final GalleryService galleryService;

    public GalleryController(GalleryService galleryService) {
        this.galleryService = galleryService;
    }

    @GetMapping({"", "/"})
    public List<GalleryEntity> getAll() { return galleryService.getAll(); }

    @GetMapping("/{id}")
    public GalleryEntity getById(@PathVariable int id) { return galleryService.getById(id); }

    @GetMapping("/{id}/photos")
    public List<PhotoEntity> getPhotos(@PathVariable int id) { return galleryService.getPhotos(id); }
}
