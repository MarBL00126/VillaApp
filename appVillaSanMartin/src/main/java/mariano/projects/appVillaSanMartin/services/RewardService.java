package mariano.projects.appVillaSanMartin.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;
import mariano.projects.appVillaSanMartin.entities.PointsAccountEntity;
import mariano.projects.appVillaSanMartin.entities.RewardEntity;
import mariano.projects.appVillaSanMartin.entities.RewardRedemptionEntity;
import mariano.projects.appVillaSanMartin.models.dto.RewardDto;
import mariano.projects.appVillaSanMartin.models.dto.RewardRedemptionDto;
import mariano.projects.appVillaSanMartin.repositories.RewardRedemptionRepository;
import mariano.projects.appVillaSanMartin.repositories.RewardRepository;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;

@Service
@RequiredArgsConstructor
public class RewardService {
    private final RewardRepository rewardRepository;
    private final RewardRedemptionRepository redemptionRepository;
    private final UserRepository userRepository;
    private final PointsService pointsService;

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "rewards-catalog")
    public List<RewardDto> getActive() {
        return rewardRepository.findByActiveTrue().stream()
                .map(RewardDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<RewardRedemptionDto> getMyRedemptions(int userId) {
        return redemptionRepository.findByUser_IdOrderByRedeemedAtDesc(userId).stream()
                .map(RewardRedemptionDto::from)
                .toList();
    }

    @Transactional
    @CacheEvict(cacheNames = "rewards-catalog", allEntries = true)
    public RewardRedemptionDto redeem(int userId, int rewardId) {
        RewardEntity reward = rewardRepository.findById(rewardId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recompensa no encontrada"));
        PointsAccountEntity account = pointsService.getOrCreateAccount(userId);
        if (account.getTotalPoints() < reward.getPointsCost()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No tenes puntos suficientes");
        }
        if (reward.getStock() != null && reward.getStock() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Recompensa sin stock");
        }
        if (reward.getStock() != null) {
            reward.setStock(reward.getStock() - 1);
            rewardRepository.save(reward);
        }

        RewardRedemptionEntity redemption = new RewardRedemptionEntity();
        redemption.setUser(userRepository.findById(userId).orElseThrow());
        redemption.setReward(reward);
        redemption.setCode("VSM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        redemption.setRedeemedAt(LocalDateTime.now());
        redemption.setExpiresAt(LocalDateTime.now().plusMonths(1));
        RewardRedemptionEntity saved = redemptionRepository.save(redemption);
        pointsService.award(userId, -reward.getPointsCost(), "REDEMPTION", saved.getId());
        return RewardRedemptionDto.from(saved);
    }
}
