package mariano.projects.appVillaSanMartin.services;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

import lombok.RequiredArgsConstructor;
import mariano.projects.appVillaSanMartin.entities.CartEntity;
import mariano.projects.appVillaSanMartin.entities.CartItemEntity;
import mariano.projects.appVillaSanMartin.entities.CouponEntity;
import mariano.projects.appVillaSanMartin.entities.ShopOrderEntity;
import mariano.projects.appVillaSanMartin.entities.ShopOrderItemEntity;
import mariano.projects.appVillaSanMartin.models.dto.ShopOrderDto;
import mariano.projects.appVillaSanMartin.repositories.CouponRepository;
import mariano.projects.appVillaSanMartin.repositories.ShopOrderItemRepository;
import mariano.projects.appVillaSanMartin.repositories.ShopOrderRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ShopOrderService {
    private final ShopOrderRepository orderRepository;
    private final ShopOrderItemRepository itemRepository;
    private final CartService cartService;
    private final CouponService couponService;
    private final CouponRepository couponRepository;
    private final BenefitService benefitService;
    private final PointsService pointsService;

    @Transactional
    public ShopOrderDto createOrder(int userId, String couponCode) {
        CartEntity cart = cartService.getCart(userId);
        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El carrito está vacío");
        }
        BigDecimal subtotal = cart.getItems().stream()
                .map(i -> i.getUnitPrice().multiply(new BigDecimal(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal discount = BigDecimal.ZERO;
        CouponEntity coupon = null;
        if (couponCode != null && !couponCode.isEmpty()) {
            coupon = couponService.validateEntity(couponCode, subtotal);
            discount = subtotal.multiply(coupon.getDiscountPct()).divide(new BigDecimal(100), 2, RoundingMode.HALF_UP);
        }
        discount = discount.add(benefitService.calculateBestDiscount(userId, "SHOP_DISCOUNT", subtotal));
        if (discount.compareTo(subtotal) > 0) {
            discount = subtotal;
        }

        ShopOrderEntity order = new ShopOrderEntity();
        order.setUser(cart.getUser());
        order.setCoupon(coupon);
        order.setSubtotal(subtotal);
        order.setDiscount(discount);
        order.setTotalAmount(subtotal.subtract(discount));
        order.setStatus("PENDING_PAYMENT");
        order.setCreatedAt(LocalDateTime.now());

        ShopOrderEntity savedOrder = orderRepository.save(order);

        for (CartItemEntity ci : cart.getItems()) {
            ShopOrderItemEntity oi = new ShopOrderItemEntity();
            oi.setOrder(savedOrder);
            oi.setProduct(ci.getProduct());
            oi.setVariant(ci.getVariant());
            oi.setQuantity(ci.getQuantity());
            oi.setUnitPrice(ci.getUnitPrice());
            itemRepository.save(oi);
        }

        cartService.clearCart(userId);
        return getOrderById(savedOrder.getId(), userId);
    }

    @Transactional(readOnly = true)
    public List<ShopOrderDto> getMyOrders(int userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream().map(ShopOrderDto::from).toList();
    }

    @Transactional(readOnly = true)
    public ShopOrderDto getOrderById(int id, int userId) {
        return ShopOrderDto.from(getOrderEntityById(id, userId));
    }

    @Transactional
    public void confirmPayment(int orderId, String mpPaymentId) {
        ShopOrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        boolean wasPaid = "PAID".equals(order.getStatus());
        order.setStatus("PAID");
        order.setMpPaymentId(mpPaymentId);
        order.setPaidAt(LocalDateTime.now());
        if (order.getCoupon() != null) {
            CouponEntity c = order.getCoupon();
            c.setUsedCount(c.getUsedCount() + 1);
            couponRepository.save(c);
        }
        orderRepository.save(order);
        if (!wasPaid && order.getTotalAmount() != null) {
            int points = order.getTotalAmount().divideToIntegralValue(new BigDecimal(100)).intValue();
            if (points > 0) {
                pointsService.award(order.getUser().getId(), points, "PURCHASE", order.getId());
            }
        }
    }

    private ShopOrderEntity getOrderEntityById(int id, int userId) {
        ShopOrderEntity order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (order.getUser().getId() != userId) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        return order;
    }
}
