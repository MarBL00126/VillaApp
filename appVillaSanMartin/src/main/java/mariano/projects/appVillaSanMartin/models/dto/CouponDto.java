package mariano.projects.appVillaSanMartin.models.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import mariano.projects.appVillaSanMartin.entities.CouponEntity;

public record CouponDto(
        int id,
        String code,
        BigDecimal discountPct,
        BigDecimal minAmount,
        LocalDateTime expiresAt,
        boolean active) {

    public static CouponDto from(CouponEntity e) {
        if (e == null) return null;
        return new CouponDto(
                e.getId(),
                e.getCode(),
                e.getDiscountPct(),
                e.getMinAmount(),
                e.getExpiresAt(),
                Boolean.TRUE.equals(e.getActive()));
    }
}
