package mariano.projects.appVillaSanMartin.models.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import mariano.projects.appVillaSanMartin.entities.ShopOrderEntity;

public record ShopOrderDto(
        int id,
        BigDecimal subtotal,
        BigDecimal discount,
        BigDecimal totalAmount,
        String status,
        LocalDateTime createdAt,
        List<ShopOrderItemDto> items,
        CouponDto coupon) {

    public static ShopOrderDto from(ShopOrderEntity e) {
        if (e == null) return null;
        List<ShopOrderItemDto> items = e.getItems() == null
                ? List.of()
                : e.getItems().stream().map(ShopOrderItemDto::from).toList();
        return new ShopOrderDto(
                e.getId(),
                e.getSubtotal(),
                e.getDiscount(),
                e.getTotalAmount(),
                e.getStatus(),
                e.getCreatedAt(),
                items,
                CouponDto.from(e.getCoupon()));
    }
}
