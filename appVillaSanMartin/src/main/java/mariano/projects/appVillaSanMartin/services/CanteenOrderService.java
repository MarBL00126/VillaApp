package mariano.projects.appVillaSanMartin.services;
import lombok.RequiredArgsConstructor;
import mariano.projects.appVillaSanMartin.entities.CanteenMenuItemEntity;
import mariano.projects.appVillaSanMartin.entities.CanteenOrderEntity;
import mariano.projects.appVillaSanMartin.entities.CanteenOrderItemEntity;
import mariano.projects.appVillaSanMartin.entities.UserEntity;
import mariano.projects.appVillaSanMartin.models.dto.CanteenOrderDto;
import mariano.projects.appVillaSanMartin.repositories.CanteenMenuItemRepository;
import mariano.projects.appVillaSanMartin.repositories.CanteenOrderItemRepository;
import mariano.projects.appVillaSanMartin.repositories.CanteenOrderRepository;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
@Service
@RequiredArgsConstructor
public class CanteenOrderService {
    private final CanteenOrderRepository orderRepo;
    private final CanteenOrderItemRepository itemRepo;
    private final UserRepository userRepo;
    private final CanteenMenuItemRepository menuItemRepo;
    private final BenefitService benefitService;

    public static class OrderItemRequest {
        public int menuItemId;
        public int quantity;
    }

    @Transactional
    public CanteenOrderDto createOrder(Integer userId, List<OrderItemRequest> items, String paymentMethod, String notes) {
        UserEntity user = null;
        if (userId != null) {
            user = userRepo.findById(userId).orElse(null);
        }
        String orderNumber = "C" + String.format("%06d", System.currentTimeMillis() % 1000000);
        BigDecimal total = BigDecimal.ZERO;
        
        CanteenOrderEntity order = new CanteenOrderEntity();
        order.setUser(user);
        order.setOrderNumber(orderNumber);
        order.setStatus("PENDING");
        order.setPaymentMethod(paymentMethod);
        order.setNotes(notes);
        order.setCreatedAt(LocalDateTime.now());
        
        // We need to save total, but first calculate it.
        for (OrderItemRequest req : items) {
            CanteenMenuItemEntity mi = menuItemRepo.findById(req.menuItemId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
            total = total.add(mi.getPrice().multiply(new BigDecimal(req.quantity)));
        }
        if (user != null) {
            BigDecimal discount = benefitService.calculateBestDiscount(user.getId(), "CANTINA_DISCOUNT", total);
            total = total.subtract(discount);
        }
        order.setTotalAmount(total);
        CanteenOrderEntity saved = orderRepo.save(order);
        
        for (OrderItemRequest req : items) {
            CanteenMenuItemEntity mi = menuItemRepo.findById(req.menuItemId).get();
            CanteenOrderItemEntity oi = new CanteenOrderItemEntity();
            oi.setOrder(saved);
            oi.setMenuItem(mi);
            oi.setQuantity(req.quantity);
            oi.setUnitPrice(mi.getPrice());
            itemRepo.save(oi);
        }
        return getByOrderNumber(saved.getOrderNumber());
    }

    @Transactional(readOnly = true)
    public CanteenOrderDto getByOrderNumber(String orderNumber) {
        return CanteenOrderDto.from(getByOrderNumberEntity(orderNumber));
    }

    @Transactional(readOnly = true)
    public List<CanteenOrderDto> getMyOrders(int userId) {
        return orderRepo.findByUserIdOrderByCreatedAtDesc(userId).stream().map(CanteenOrderDto::from).toList();
    }

    @Transactional
    public void updateStatus(String orderNumber, String status) {
        CanteenOrderEntity order = getByOrderNumberEntity(orderNumber);
        order.setStatus(status);
        if ("READY".equals(status)) {
            order.setReadyAt(LocalDateTime.now());
        }
        orderRepo.save(order);
    }

    private CanteenOrderEntity getByOrderNumberEntity(String orderNumber) {
        return orderRepo.findByOrderNumber(orderNumber).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }
}
