package mariano.projects.appVillaSanMartin.services;

import lombok.RequiredArgsConstructor;
import mariano.projects.appVillaSanMartin.entities.CanteenInfoEntity;
import mariano.projects.appVillaSanMartin.models.dto.CanteenInfoDto;
import mariano.projects.appVillaSanMartin.models.dto.CanteenMenuCategoryDto;
import mariano.projects.appVillaSanMartin.models.dto.CanteenMenuItemDto;
import mariano.projects.appVillaSanMartin.repositories.CanteenInfoRepository;
import mariano.projects.appVillaSanMartin.repositories.CanteenMenuCategoryRepository;
import mariano.projects.appVillaSanMartin.repositories.CanteenMenuItemRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CanteenService {
    private final CanteenInfoRepository infoRepo;
    private final CanteenMenuItemRepository itemRepo;
    private final CanteenMenuCategoryRepository catRepo;

    @Transactional
    @Cacheable(cacheNames = "canteenInfo")
    public CanteenInfoDto getInfo() {
        return CanteenInfoDto.from(getInfoEntity());
    }

    private CanteenInfoEntity getInfoEntity() {
        return infoRepo.findAll().stream().findFirst().orElseGet(() -> {
            CanteenInfoEntity info = new CanteenInfoEntity();
            info.setAddress("Estadio Villa San Martin - Acceso Norte");
            info.setPhone("2664-000000");
            info.setSchedule("Dias de partido: 2hs antes del inicio hasta el final del juego");
            info.setPaymentMethods("Efectivo / MercadoPago / Transferencia");
            info.setMapsUrl("https://maps.google.com");
            info.setIsOpen(false);
            info.setUpdatedAt(LocalDateTime.now());
            return infoRepo.save(info);
        });
    }

    @Transactional
    @CacheEvict(cacheNames = "canteenInfo", allEntries = true)
    public void updateOpenStatus(boolean isOpen) {
        CanteenInfoEntity info = getInfoEntity();
        info.setIsOpen(isOpen);
        infoRepo.save(info);
    }

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "canteenMenu")
    public List<CanteenMenuItemDto> getMenu() {
        return itemRepo.findByAvailableTrue().stream().map(CanteenMenuItemDto::from).toList();
    }

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "canteenMenuByCategory")
    public Map<String, List<CanteenMenuItemDto>> getMenuByCategory() {
        return itemRepo.findByAvailableTrue().stream()
                .map(CanteenMenuItemDto::from)
                .collect(Collectors.groupingBy(item -> item.category() == null ? null : item.category().name()));
    }

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "canteenMenuCategories")
    public List<CanteenMenuCategoryDto> getCategories() {
        return catRepo.findAllByOrderBySortOrder().stream().map(CanteenMenuCategoryDto::from).toList();
    }
}
