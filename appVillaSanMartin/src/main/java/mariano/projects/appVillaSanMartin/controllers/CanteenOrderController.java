package mariano.projects.appVillaSanMartin.controllers;
import mariano.projects.appVillaSanMartin.entities.UserEntity;
import mariano.projects.appVillaSanMartin.models.dto.CanteenOrderDto;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;
import mariano.projects.appVillaSanMartin.services.CanteenOrderService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cantina/orders")
public class CanteenOrderController {
    private final CanteenOrderService orderService;
    private final UserRepository userRepository;

    public CanteenOrderController(CanteenOrderService orderService, UserRepository userRepository) {
        this.orderService = orderService;
        this.userRepository = userRepository;
    }

    private UserEntity getUser(Authentication auth) {
        if (auth == null) return null;
        Object principal = auth.getPrincipal();
        if (principal instanceof UserDetails) {
            UserDetails details = (UserDetails) principal;
            return userRepository.findByEmail(details.getUsername()).orElse(null);
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    @PostMapping({"", "/"})
    public CanteenOrderDto createOrder(@RequestBody Map<String, Object> body, Authentication auth) {
        List<Map<String, Integer>> itemsList = (List<Map<String, Integer>>) body.get("items");
        List<CanteenOrderService.OrderItemRequest> reqs = itemsList.stream().map(m -> {
            CanteenOrderService.OrderItemRequest req = new CanteenOrderService.OrderItemRequest();
            req.menuItemId = m.get("menuItemId");
            req.quantity = m.get("quantity");
            return req;
        }).toList();
        String paymentMethod = (String) body.get("paymentMethod");
        String notes = (String) body.get("notes");
        UserEntity u = getUser(auth);
        Integer userId = u != null ? u.getId() : null;
        return orderService.createOrder(userId, reqs, paymentMethod, notes);
    }

    @GetMapping("/track/{orderNumber}")
    public CanteenOrderDto trackOrder(@PathVariable String orderNumber) {
        return orderService.getByOrderNumber(orderNumber);
    }

    @GetMapping("/my")
    public List<CanteenOrderDto> getMyOrders(Authentication auth) {
        UserEntity u = getUser(auth);
        if (u == null) return List.of();
        return orderService.getMyOrders(u.getId());
    }

    @PatchMapping("/{orderNumber}/status")
    public void updateStatus(@PathVariable String orderNumber, @RequestBody Map<String, String> body) {
        orderService.updateStatus(orderNumber, body.get("status"));
    }
}
