package mariano.projects.appVillaSanMartin.services;
import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductCategoryRepository categoryRepository;
    private final ProductVariantRepository variantRepository;
    public List<ProductEntity> getAll() { return productRepository.findAll(); }
    public List<ProductEntity> getAllActive() { return productRepository.findByActiveTrue(); }
    public ProductEntity getById(int id) {
        return productRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }
    public List<ProductEntity> getByCategory(String slug) {
        ProductCategoryEntity cat = categoryRepository.findBySlug(slug).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return productRepository.findByCategoryIdAndActiveTrue(cat.getId());
    }
    public List<ProductVariantEntity> getVariants(int productId) {
        return variantRepository.findByProductId(productId);
    }
}
