package mariano.projects.appVillaSanMartin.controllers;

import java.util.List;

import mariano.projects.appVillaSanMartin.models.dto.NewsCategoryDto;
import mariano.projects.appVillaSanMartin.models.dto.NewsDto;
import mariano.projects.appVillaSanMartin.models.dto.PageResponses;
import mariano.projects.appVillaSanMartin.services.NewsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/news")
public class NewsController {
    private final NewsService newsService;

    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    @GetMapping({"", "/"})
    public ResponseEntity<List<NewsDto>> getAll(@RequestParam(defaultValue = "0") int page,
                                                @RequestParam(defaultValue = "20") int size) {
        return PageResponses.of(newsService.getAll(PageResponses.pageable(page, size)));
    }

    @GetMapping("/featured")
    public List<NewsDto> getFeatured() { return newsService.getFeatured(); }

    @GetMapping("/{id}")
    public NewsDto getById(@PathVariable int id) { return newsService.getById(id); }

    @GetMapping("/category/{slug}")
    public ResponseEntity<List<NewsDto>> getByCategory(@PathVariable String slug,
                                                       @RequestParam(defaultValue = "0") int page,
                                                       @RequestParam(defaultValue = "20") int size) {
        return PageResponses.of(newsService.getByCategory(slug, PageResponses.pageable(page, size)));
    }

    @GetMapping("/search")
    public ResponseEntity<List<NewsDto>> search(@RequestParam(name = "query", required = false) String query,
                                                @RequestParam(name = "q", required = false) String legacyQuery,
                                                @RequestParam(defaultValue = "0") int page,
                                                @RequestParam(defaultValue = "20") int size) {
        String term = query != null ? query : legacyQuery;
        return PageResponses.of(newsService.search(term, PageResponses.pageable(page, size)));
    }

    @GetMapping("/{id}/related")
    public List<NewsDto> getRelated(@PathVariable int id) { return newsService.getRelated(id); }

    @GetMapping("/categories")
    public List<NewsCategoryDto> getCategories() { return newsService.getCategories(); }
}
