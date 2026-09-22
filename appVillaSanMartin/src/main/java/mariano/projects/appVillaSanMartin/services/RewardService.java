package mariano.projects.appVillaSanMartin.services;

import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RewardService {
    private final RewardRepository rewardRepository;
    private final RewardRedemptionRepository redemptionRepository;
    private final UserRepository userRepository;
    private final PointsService pointsService;

    public List<RewardEntity> getActive() {
        return rewardRepository.findByActiveTrue();
    }

    public List<RewardRedemptionEntity> getMyRedemptions(int userId) {
        return redemptionRepository.findByUser_IdOrderByRedeemedAtDesc(userId);
    }

    @Transactional
    public RewardRedemptionEntity redeem(int userId, int rewardId) {
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
        return saved;
    }
}
