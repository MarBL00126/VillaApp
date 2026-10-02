package mariano.projects.appVillaSanMartin.services;
import lombok.RequiredArgsConstructor;
import mariano.projects.appVillaSanMartin.entities.ProductCategoryEntity;
import mariano.projects.appVillaSanMartin.entities.ProductEntity;
import mariano.projects.appVillaSanMartin.models.dto.ProductDto;
import mariano.projects.appVillaSanMartin.models.dto.ProductVariantDto;
import mariano.projects.appVillaSanMartin.repositories.ProductCategoryRepository;
import mariano.projects.appVillaSanMartin.repositories.ProductRepository;
import mariano.projects.appVillaSanMartin.repositories.ProductVariantRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductCategoryRepository categoryRepository;
    private final ProductVariantRepository variantRepository;

    public List<ProductEntity> getAll() { return productRepository.findAll(); }

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "activeProducts")
    public List<ProductDto> getAllActive() {
        return productRepository.findByActiveTrue().stream().map(ProductDto::from).toList();
    }

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "productById", key = "#id")
    public ProductDto getById(int id) {
        return ProductDto.from(productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND)));
    }

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "productsByCategory", key = "#slug")
    public List<ProductDto> getByCategory(String slug) {
        ProductCategoryEntity cat = categoryRepository.findBySlug(slug).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return productRepository.findByCategoryIdAndActiveTrue(cat.getId()).stream().map(ProductDto::from).toList();
    }

    @Transactional(readOnly = true)
    public List<ProductVariantDto> getVariants(int productId) {
        return variantRepository.findByProductId(productId).stream().map(ProductVariantDto::from).toList();
    }
}
