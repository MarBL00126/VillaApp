package mariano.projects.appVillaSanMartin.controllers;
import mariano.projects.appVillaSanMartin.entities.UserEntity;
import mariano.projects.appVillaSanMartin.models.dto.ShopOrderDto;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;
import mariano.projects.appVillaSanMartin.services.ShopOrderService;
import mariano.projects.appVillaSanMartin.services.ShopPaymentService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shop/orders")
public class ShopOrderController {
    private final ShopOrderService orderService;
    private final ShopPaymentService paymentService;
    private final UserRepository userRepository;

    public ShopOrderController(ShopOrderService orderService, ShopPaymentService paymentService, UserRepository userRepository) {
        this.orderService = orderService;
        this.paymentService = paymentService;
        this.userRepository = userRepository;
    }

    private UserEntity getUser(Authentication auth) {
        UserDetails details = (UserDetails) auth.getPrincipal();
        return userRepository.findByEmail(details.getUsername()).orElseThrow();
    }

    @PostMapping({"", "/"})
    public ShopOrderDto createOrder(@RequestBody(required = false) Map<String, String> body, Authentication auth) {
        String couponCode = body != null ? body.get("couponCode") : null;
        return orderService.createOrder(getUser(auth).getId(), couponCode);
    }

    @GetMapping("/my")
    public List<ShopOrderDto> getMyOrders(Authentication auth) {
        return orderService.getMyOrders(getUser(auth).getId());
    }

    @GetMapping("/{id}")
    public ShopOrderDto getOrderById(@PathVariable int id, Authentication auth) {
        return orderService.getOrderById(id, getUser(auth).getId());
    }

    @PostMapping("/{id}/pay")
    public Map<String, String> payOrder(@PathVariable int id, Authentication auth) throws Exception {
        orderService.getOrderById(id, getUser(auth).getId());
        String initPoint = paymentService.createPreference((long) id);
        return Map.of("initPoint", initPoint);
    }
}
