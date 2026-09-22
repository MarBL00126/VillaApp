package mariano.projects.appVillaSanMartin.services;

import java.util.List;

import org.springframework.stereotype.Service;

import mariano.projects.appVillaSanMartin.entities.ProductVariantEntity;
import mariano.projects.appVillaSanMartin.repositories.ProductVariantRepository;

@Service
public class ProductVariantService {
    private final ProductVariantRepository productVariantRepository;

    public ProductVariantService(ProductVariantRepository productVariantRepository) {
        this.productVariantRepository = productVariantRepository;
    }

    public List<ProductVariantEntity> findAll() {
        return productVariantRepository.findAll();
    }

    public ProductVariantEntity findById(Integer id) {
        return productVariantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Variante no encontrada"));
    }

    public List<ProductVariantEntity> findByProductId(Integer productId) {
        return productVariantRepository.findByProductId(productId);
    }

    public ProductVariantEntity save(ProductVariantEntity variant) {
        return productVariantRepository.save(variant);
    }

    public void delete(Integer id) {
        productVariantRepository.deleteById(id);
    }
}
