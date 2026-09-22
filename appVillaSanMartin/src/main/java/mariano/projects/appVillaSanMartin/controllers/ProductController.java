package mariano.projects.appVillaSanMartin.controllers;
import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.services.*;
import mariano.projects.appVillaSanMartin.repositories.ProductCategoryRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;
    private final ProductCategoryRepository categoryRepository;

    public ProductController(ProductService productService, ProductCategoryRepository categoryRepository) {
        this.productService = productService;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping({"", "/"})
    public List<ProductEntity> getAll() { return productService.getAllActive(); }

    @GetMapping("/{id}")
    public ProductEntity getById(@PathVariable int id) { return productService.getById(id); }

    @GetMapping("/categories")
    public List<ProductCategoryEntity> getCategories() { return categoryRepository.findByActiveTrue(); }

    @GetMapping("/category/{slug}")
    public List<ProductEntity> getByCategory(@PathVariable String slug) { return productService.getByCategory(slug); }

    @GetMapping("/{id}/variants")
    public List<ProductVariantEntity> getVariants(@PathVariable int id) { return productService.getVariants(id); }
}
