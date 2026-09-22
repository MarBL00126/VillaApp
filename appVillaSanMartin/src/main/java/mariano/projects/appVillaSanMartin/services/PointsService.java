package mariano.projects.appVillaSanMartin.services;

import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PointsService {
    private final PointsAccountRepository accountRepository;
    private final PointsTransactionRepository transactionRepository;
    private final BadgeRepository badgeRepository;
    private final UserBadgeRepository userBadgeRepository;
    private final UserRepository userRepository;

    public PointsAccountEntity getOrCreateAccount(int userId) {
        return accountRepository.findByUser_Id(userId).orElseGet(() -> {
            UserEntity user = userRepository.findById(userId).orElseThrow();
            PointsAccountEntity account = new PointsAccountEntity();
            account.setUser(user);
            account.setTotalPoints(Math.max(0, user.getPoints()));
            account.setLevel(resolveLevel(account.getTotalPoints()));
            account.setUpdatedAt(LocalDateTime.now());
            return accountRepository.save(account);
        });
    }

    public List<PointsTransactionEntity> getTransactions(int userId) {
        getOrCreateAccount(userId);
        return transactionRepository.findByAccount_User_IdOrderByCreatedAtDesc(userId);
    }

    public List<PointsAccountEntity> getLeaderboard() {
        return accountRepository.findTop10ByOrderByTotalPointsDesc();
    }

    @Transactional
    public PointsAccountEntity award(int userId, int amount, String reason, Integer referenceId) {
        PointsAccountEntity account = getOrCreateAccount(userId);
        int total = Math.max(0, account.getTotalPoints() + amount);
        account.setTotalPoints(total);
        account.setLevel(resolveLevel(total));
        account.setUpdatedAt(LocalDateTime.now());
        accountRepository.save(account);

        UserEntity user = account.getUser();
        user.setPoints(total);
        userRepository.save(user);

        PointsTransactionEntity tx = new PointsTransactionEntity();
        tx.setAccount(account);
        tx.setAmount(amount);
        tx.setReason(reason);
        tx.setReferenceId(referenceId);
        tx.setCreatedAt(LocalDateTime.now());
        transactionRepository.save(tx);

        unlockBadges(user, total);
        return account;
    }

    private void unlockBadges(UserEntity user, int totalPoints) {
        for (BadgeEntity badge : badgeRepository.findByActiveTrueOrderByRequiredPointsAsc()) {
            if (badge.getRequiredPoints() <= totalPoints && !userBadgeRepository.existsByUser_IdAndBadge_Id(user.getId(), badge.getId())) {
                UserBadgeEntity earned = new UserBadgeEntity();
                earned.setUser(user);
                earned.setBadge(badge);
                earned.setEarnedAt(LocalDateTime.now());
                userBadgeRepository.save(earned);
            }
        }
    }

    private String resolveLevel(int points) {
        if (points >= 2000) return "LEGEND";
        if (points >= 500) return "SUPERFAN";
        if (points >= 100) return "FAN";
        return "ROOKIE";
    }
}
