package mariano.projects.appVillaSanMartin.services;

import lombok.RequiredArgsConstructor;
import mariano.projects.appVillaSanMartin.entities.CouponEntity;
import mariano.projects.appVillaSanMartin.models.dto.CouponDto;
import mariano.projects.appVillaSanMartin.repositories.CouponRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CouponService {
    private final CouponRepository couponRepository;

    @Transactional(readOnly = true)
    public CouponDto validate(String code, BigDecimal amount) {
        return CouponDto.from(validateEntity(code, amount));
    }

    @Transactional(readOnly = true)
    public CouponEntity validateEntity(String code, BigDecimal amount) {
        CouponEntity coupon = couponRepository.findByCode(code).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cupón no encontrado"));
        if (!coupon.getActive() || (coupon.getExpiresAt() != null && coupon.getExpiresAt().isBefore(LocalDateTime.now()))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cupón inválido o expirado");
        }
        if (coupon.getMaxUses() != null && coupon.getUsedCount() >= coupon.getMaxUses()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cupón agotado");
        }
        if (coupon.getMinAmount() != null && amount.compareTo(coupon.getMinAmount()) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Monto mínimo no alcanzado");
        }
        return coupon;
    }
}
