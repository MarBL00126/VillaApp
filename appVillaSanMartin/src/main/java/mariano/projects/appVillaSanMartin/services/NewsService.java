package mariano.projects.appVillaSanMartin.services;

import java.util.List;

import lombok.RequiredArgsConstructor;
import mariano.projects.appVillaSanMartin.entities.NewsCategoryEntity;
import mariano.projects.appVillaSanMartin.entities.NewsEntity;
import mariano.projects.appVillaSanMartin.models.dto.NewsCategoryDto;
import mariano.projects.appVillaSanMartin.models.dto.NewsDto;
import mariano.projects.appVillaSanMartin.repositories.NewsCategoryRepository;
import mariano.projects.appVillaSanMartin.repositories.NewsRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class NewsService {
    private final NewsRepository newsRepository;
    private final NewsCategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public Page<NewsDto> getAll(Pageable pageable) {
        return newsRepository.findAll(pageable).map(NewsDto::from);
    }

    @Transactional(readOnly = true)
    public List<NewsDto> getFeatured() {
        return newsRepository.findByFeaturedTrueOrderByPublishedAtDesc().stream().map(NewsDto::from).toList();
    }

    @Transactional(readOnly = true)
    public NewsDto getById(int id) {
        return NewsDto.from(getEntityById(id));
    }

    @Transactional(readOnly = true)
    public Page<NewsDto> getByCategory(String slug, Pageable pageable) {
        NewsCategoryEntity category = categoryRepository.findBySlug(slug)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return newsRepository.findByCategoryIdOrderByPublishedAtDesc(category.getId(), pageable).map(NewsDto::from);
    }

    @Transactional(readOnly = true)
    public Page<NewsDto> search(String query, Pageable pageable) {
        String term = query == null ? "" : query;
        return newsRepository.findByTitleContainingIgnoreCaseOrSummaryContainingIgnoreCase(term, term, pageable)
            .map(NewsDto::from);
    }

    @Transactional(readOnly = true)
    public List<NewsDto> getRelated(int newsId) {
        NewsEntity news = getEntityById(newsId);
        if (news.getCategory() == null) {
            return List.of();
        }
        return newsRepository.findByCategoryIdOrderByPublishedAtDesc(news.getCategory().getId()).stream()
            .filter(candidate -> !candidate.getId().equals(newsId))
            .limit(3)
            .map(NewsDto::from)
            .toList();
    }

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "news-categories")
    public List<NewsCategoryDto> getCategories() {
        return categoryRepository.findAll().stream().map(NewsCategoryDto::from).toList();
    }

    private NewsEntity getEntityById(int id) {
        return newsRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }
}
