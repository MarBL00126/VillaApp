package mariano.projects.appVillaSanMartin.controllers;

import mariano.projects.appVillaSanMartin.models.dto.CanteenInfoDto;
import mariano.projects.appVillaSanMartin.models.dto.CanteenMenuCategoryDto;
import mariano.projects.appVillaSanMartin.models.dto.CanteenMenuItemDto;
import mariano.projects.appVillaSanMartin.services.CanteenService;
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
    public CanteenInfoDto getInfo() { return cantinaService.getInfo(); }

    @GetMapping("/menu")
    public List<CanteenMenuItemDto> getMenu() { return cantinaService.getMenu(); }

    @GetMapping("/menu/categories")
    public Map<String, List<CanteenMenuItemDto>> getMenuByCategory() { return cantinaService.getMenuByCategory(); }

    @GetMapping("/categories")
    public List<CanteenMenuCategoryDto> getCategories() { return cantinaService.getCategories(); }

    @PatchMapping("/info/status")
    public void updateStatus(@RequestBody Map<String, Boolean> body) {
        cantinaService.updateOpenStatus(body.get("isOpen"));
    }
}
