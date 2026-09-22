package mariano.projects.appVillaSanMartin.services;
import mariano.projects.appVillaSanMartin.entities.BenefitEntity;
import mariano.projects.appVillaSanMartin.repositories.BenefitRepository;
import mariano.projects.appVillaSanMartin.repositories.MembershipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.Collections;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
@Service
@RequiredArgsConstructor
public class BenefitService {
    private final BenefitRepository benefitRepository;
    private final MembershipRepository membershipRepository;
    public List<BenefitEntity> getAll() { return benefitRepository.findByActiveTrue(); }
    public BenefitEntity getById(int id) {
        return benefitRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }
    public List<BenefitEntity> getForMember(int userId) {
        boolean isActive = membershipRepository.findByUser_Id(userId)
            .map(m -> "ACTIVE".equals(m.getStatus())).orElse(false);
        if (!isActive) return Collections.emptyList();
        return benefitRepository.findByActiveTrue();
    }
    public BigDecimal calculateBestDiscount(int userId, String type, BigDecimal subtotal) {
        if (subtotal == null || subtotal.signum() <= 0) return BigDecimal.ZERO;
        boolean isActive = membershipRepository.findByUser_Id(userId)
            .map(m -> "ACTIVE".equals(m.getStatus())).orElse(false);
        if (!isActive) return BigDecimal.ZERO;

        double bestPct = benefitRepository.findByActiveTrue().stream()
            .filter(b -> type.equals(b.getType()))
            .filter(b -> b.getDiscountPct() != null && b.getDiscountPct().signum() > 0)
            .map(BenefitEntity::getDiscountPct)
            .max(BigDecimal::compareTo)
            .orElse(BigDecimal.ZERO)
            .doubleValue();

        if (bestPct <= 0) return BigDecimal.ZERO;
        return subtotal.multiply(BigDecimal.valueOf(bestPct))
            .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
    }
}
