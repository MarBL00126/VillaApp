package mariano.projects.appVillaSanMartin.controllers;
import mariano.projects.appVillaSanMartin.models.dto.ProductCategoryDto;
import mariano.projects.appVillaSanMartin.models.dto.ProductDto;
import mariano.projects.appVillaSanMartin.models.dto.ProductVariantDto;
import mariano.projects.appVillaSanMartin.services.ProductCategoryService;
import mariano.projects.appVillaSanMartin.services.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;
    private final ProductCategoryService productCategoryService;

    public ProductController(ProductService productService, ProductCategoryService productCategoryService) {
        this.productService = productService;
        this.productCategoryService = productCategoryService;
    }

    @GetMapping({"", "/"})
    public List<ProductDto> getAll() { return productService.getAllActive(); }

    @GetMapping("/{id}")
    public ProductDto getById(@PathVariable int id) { return productService.getById(id); }

    @GetMapping("/categories")
    public List<ProductCategoryDto> getCategories() { return productCategoryService.getActiveCategories(); }

    @GetMapping("/category/{slug}")
    public List<ProductDto> getByCategory(@PathVariable String slug) { return productService.getByCategory(slug); }

    @GetMapping("/{id}/variants")
    public List<ProductVariantDto> getVariants(@PathVariable int id) { return productService.getVariants(id); }
}
