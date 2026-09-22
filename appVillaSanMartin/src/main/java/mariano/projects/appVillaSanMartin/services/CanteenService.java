package mariano.projects.appVillaSanMartin.services;
import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
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
    public CanteenInfoEntity getInfo() {
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
    public void updateOpenStatus(boolean isOpen) {
        CanteenInfoEntity info = getInfo();
        info.setIsOpen(isOpen);
        infoRepo.save(info);
    }
    public List<CanteenMenuItemEntity> getMenu() { return itemRepo.findByAvailableTrue(); }
    public Map<String, List<CanteenMenuItemEntity>> getMenuByCategory() {
        return itemRepo.findByAvailableTrue().stream().collect(Collectors.groupingBy(i -> i.getCategory().getName()));
    }
    public List<CanteenMenuCategoryEntity> getCategories() { return catRepo.findAllByOrderBySortOrder(); }
}
