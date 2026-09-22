package mariano.projects.appVillaSanMartin.services;

import java.util.List;

import mariano.projects.appVillaSanMartin.entities.ProductCategoryEntity;
import mariano.projects.appVillaSanMartin.repositories.ProductCategoryRepository;
import org.springframework.stereotype.Service;

@Service
public class ProductCategoryService {
    private final ProductCategoryRepository productCategoryRepository;

    public ProductCategoryService(ProductCategoryRepository productCategoryRepository) {
        this.productCategoryRepository = productCategoryRepository;
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

    public ProductCategoryEntity save(ProductCategoryEntity productCategory) {
        return productCategoryRepository.save(productCategory);
    }

    public void delete(Integer id) {
        productCategoryRepository.deleteById(id);
        ;
    }
}
