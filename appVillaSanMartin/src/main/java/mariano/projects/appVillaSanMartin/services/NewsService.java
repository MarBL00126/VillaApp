package mariano.projects.appVillaSanMartin.services;
import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class NewsService {
    private final NewsRepository newsRepository;
    private final NewsCategoryRepository categoryRepository;
    public List<NewsEntity> getAll() { return newsRepository.findAll(); }
    public List<NewsEntity> getFeatured() { return newsRepository.findByFeaturedTrueOrderByPublishedAtDesc(); }
    public NewsEntity getById(int id) { return newsRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND)); }
    public List<NewsEntity> getByCategory(String slug) {
        NewsCategoryEntity cat = categoryRepository.findBySlug(slug).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return newsRepository.findByCategoryIdOrderByPublishedAtDesc(cat.getId());
    }
    public List<NewsEntity> search(String q) {
        return newsRepository.findByTitleContainingIgnoreCaseOrSummaryContainingIgnoreCase(q, q);
    }
    public List<NewsEntity> getRelated(int newsId) {
        NewsEntity n = getById(newsId);
        if (n.getCategory() == null) return List.of();
        return newsRepository.findByCategoryIdOrderByPublishedAtDesc(n.getCategory().getId())
            .stream().filter(x -> !x.getId().equals(newsId)).limit(3).collect(Collectors.toList());
    }
}
