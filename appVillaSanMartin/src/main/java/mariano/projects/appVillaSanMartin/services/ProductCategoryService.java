package mariano.projects.appVillaSanMartin.services;

import java.util.List;

import mariano.projects.appVillaSanMartin.models.dto.ProductCategoryDto;
import mariano.projects.appVillaSanMartin.entities.ProductCategoryEntity;
import mariano.projects.appVillaSanMartin.repositories.ProductCategoryRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductCategoryService {
    private final ProductCategoryRepository productCategoryRepository;

    public ProductCategoryService(ProductCategoryRepository productCategoryRepository) {
        this.productCategoryRepository = productCategoryRepository;
    }

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "productCategories")
    public List<ProductCategoryDto> getActiveCategories() {
        return productCategoryRepository.findByActiveTrue().stream().map(ProductCategoryDto::from).toList();
    }

    public List<ProductCategoryEntity> findAll() {
        return productCategoryRepository.findAll();
    }

    public ProductCategoryEntity findById(Integer id) {
        return productCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
    }

    public ProductCategoryEntity findBySlug(String slug) {
        return productCategoryRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(cacheNames = "productCategories", allEntries = true),
            @CacheEvict(cacheNames = "activeProducts", allEntries = true),
            @CacheEvict(cacheNames = "productById", allEntries = true),
            @CacheEvict(cacheNames = "productsByCategory", allEntries = true)
    })
    public ProductCategoryEntity save(ProductCategoryEntity productCategory) {
        return productCategoryRepository.save(productCategory);
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(cacheNames = "productCategories", allEntries = true),
            @CacheEvict(cacheNames = "activeProducts", allEntries = true),
            @CacheEvict(cacheNames = "productById", allEntries = true),
            @CacheEvict(cacheNames = "productsByCategory", allEntries = true)
    })
    public void delete(Integer id) {
        productCategoryRepository.deleteById(id);
    }
}
