package mariano.projects.appVillaSanMartin.controllers;
import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.services.*;
import mariano.projects.appVillaSanMartin.repositories.NewsCategoryRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/news")
public class NewsController {
    private final NewsService newsService;
    private final NewsCategoryRepository catRepo;

    public NewsController(NewsService newsService, NewsCategoryRepository catRepo) {
        this.newsService = newsService;
        this.catRepo = catRepo;
    }

    @GetMapping({"", "/"})
    public List<NewsEntity> getAll() { return newsService.getAll(); }

    @GetMapping("/featured")
    public List<NewsEntity> getFeatured() { return newsService.getFeatured(); }

    @GetMapping("/{id}")
    public NewsEntity getById(@PathVariable int id) { return newsService.getById(id); }

    @GetMapping("/category/{slug}")
    public List<NewsEntity> getByCategory(@PathVariable String slug) { return newsService.getByCategory(slug); }

    @GetMapping("/search")
    public List<NewsEntity> search(@RequestParam String q) { return newsService.search(q); }

    @GetMapping("/{id}/related")
    public List<NewsEntity> getRelated(@PathVariable int id) { return newsService.getRelated(id); }

    @GetMapping("/categories")
    public List<NewsCategoryEntity> getCategories() { return catRepo.findAll(); }
}
