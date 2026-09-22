package mariano.projects.appVillaSanMartin.controllers;
import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.services.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cantina")
public class CanteenController {
    private final CanteenService cantinaService;

    public CanteenController(CanteenService cantinaService) {
        this.cantinaService = cantinaService;
    }

    @GetMapping("/info")
    public CanteenInfoEntity getInfo() { return cantinaService.getInfo(); }

    @GetMapping("/menu")
    public List<CanteenMenuItemEntity> getMenu() { return cantinaService.getMenu(); }

    @GetMapping("/menu/categories")
    public Map<String, List<CanteenMenuItemEntity>> getMenuByCategory() { return cantinaService.getMenuByCategory(); }

    @GetMapping("/categories")
    public List<CanteenMenuCategoryEntity> getCategories() { return cantinaService.getCategories(); }

    @PatchMapping("/info/status")
    public void updateStatus(@RequestBody Map<String, Boolean> body) {
        cantinaService.updateOpenStatus(body.get("isOpen"));
    }
}
