package mariano.projects.appVillaSanMartin.services;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Collections;
import java.util.List;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;
import mariano.projects.appVillaSanMartin.entities.BenefitEntity;
import mariano.projects.appVillaSanMartin.models.dto.BenefitDto;
import mariano.projects.appVillaSanMartin.repositories.BenefitRepository;
import mariano.projects.appVillaSanMartin.repositories.MembershipRepository;

@Service
@RequiredArgsConstructor
public class BenefitService {
    private final BenefitRepository benefitRepository;
    private final MembershipRepository membershipRepository;

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "benefits-public")
    public List<BenefitDto> getAll() {
        return benefitRepository.findByActiveTrue().stream()
                .map(BenefitDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "benefit-by-id", key = "#id")
    public BenefitDto getById(int id) {
        return BenefitDto.from(getBenefitEntity(id));
    }

    @Transactional(readOnly = true)
    public List<BenefitDto> getForMember(int userId) {
        boolean isActive = membershipRepository.findByUser_Id(userId)
                .map(m -> "ACTIVE".equals(m.getStatus()))
                .orElse(false);
        if (!isActive) {
            return Collections.emptyList();
        }
        return benefitRepository.findByActiveTrue().stream()
                .map(BenefitDto::from)
                .toList();
    }

    public BigDecimal calculateBestDiscount(int userId, String type, BigDecimal subtotal) {
        if (subtotal == null || subtotal.signum() <= 0) {
            return BigDecimal.ZERO;
        }

        boolean isActive = membershipRepository.findByUser_Id(userId)
                .map(m -> "ACTIVE".equals(m.getStatus()))
                .orElse(false);
        if (!isActive) {
            return BigDecimal.ZERO;
        }

        double bestPct = benefitRepository.findByActiveTrue().stream()
                .filter(b -> type.equals(b.getType()))
                .filter(b -> b.getDiscountPct() != null && b.getDiscountPct().signum() > 0)
                .map(BenefitEntity::getDiscountPct)
                .max(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO)
                .doubleValue();

        if (bestPct <= 0) {
            return BigDecimal.ZERO;
        }

        return subtotal.multiply(BigDecimal.valueOf(bestPct))
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
    }

    private BenefitEntity getBenefitEntity(int id) {
        return benefitRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }
}
