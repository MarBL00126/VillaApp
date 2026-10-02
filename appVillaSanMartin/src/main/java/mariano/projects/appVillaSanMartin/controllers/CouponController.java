package mariano.projects.appVillaSanMartin.controllers;
import mariano.projects.appVillaSanMartin.models.dto.CouponDto;
import mariano.projects.appVillaSanMartin.services.CouponService;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {
    private final CouponService couponService;

    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    @PostMapping("/validate")
    public CouponDto validate(@RequestBody Map<String, Object> body) {
        String code = (String) body.get("code");
        BigDecimal amount = new BigDecimal(body.get("amount").toString());
        return couponService.validate(code, amount);
    }
}
