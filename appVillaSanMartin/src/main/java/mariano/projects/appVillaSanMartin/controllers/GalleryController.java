package mariano.projects.appVillaSanMartin.controllers;

import java.util.List;

import mariano.projects.appVillaSanMartin.models.dto.GalleryDto;
import mariano.projects.appVillaSanMartin.models.dto.PageResponses;
import mariano.projects.appVillaSanMartin.models.dto.PhotoDto;
import mariano.projects.appVillaSanMartin.services.GalleryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/galleries")
public class GalleryController {
    private final GalleryService galleryService;

    public GalleryController(GalleryService galleryService) {
        this.galleryService = galleryService;
    }

    @GetMapping({"", "/"})
    public ResponseEntity<List<GalleryDto>> getAll(@RequestParam(defaultValue = "0") int page,
                                                   @RequestParam(defaultValue = "20") int size) {
        return PageResponses.of(galleryService.getAll(PageResponses.pageable(page, size)));
    }

    @GetMapping("/{id}")
    public GalleryDto getById(@PathVariable int id) { return galleryService.getById(id); }

    @GetMapping("/{id}/photos")
    public ResponseEntity<List<PhotoDto>> getPhotos(@PathVariable int id,
                                                    @RequestParam(defaultValue = "0") int page,
                                                    @RequestParam(defaultValue = "20") int size) {
        return PageResponses.of(galleryService.getPhotos(id, PageResponses.pageable(page, size)));
    }
}
