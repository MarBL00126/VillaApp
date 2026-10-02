package mariano.projects.appVillaSanMartin.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import mariano.projects.appVillaSanMartin.entities.PointsAccountEntity;
import mariano.projects.appVillaSanMartin.entities.PointsTransactionEntity;
import mariano.projects.appVillaSanMartin.entities.UserBadgeEntity;
import mariano.projects.appVillaSanMartin.entities.UserEntity;
import mariano.projects.appVillaSanMartin.models.dto.PointsAccountDto;
import mariano.projects.appVillaSanMartin.models.dto.PointsTransactionDto;
import mariano.projects.appVillaSanMartin.repositories.BadgeRepository;
import mariano.projects.appVillaSanMartin.repositories.PointsAccountRepository;
import mariano.projects.appVillaSanMartin.repositories.PointsTransactionRepository;
import mariano.projects.appVillaSanMartin.repositories.UserBadgeRepository;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;

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
            account.setTotalPoints(0);
            account.setLevel(resolveLevel(0));
            account.setUpdatedAt(LocalDateTime.now());
            return accountRepository.save(account);
        });
    }

    @Transactional
    public PointsAccountDto getAccountDto(int userId) {
        return PointsAccountDto.from(getOrCreateAccount(userId));
    }

    @Transactional
    public List<PointsTransactionDto> getTransactions(int userId) {
        getOrCreateAccount(userId);
        return transactionRepository.findByAccount_User_IdOrderByCreatedAtDesc(userId).stream()
                .map(PointsTransactionDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PointsAccountDto> getLeaderboard() {
        return accountRepository.findTop10ByOrderByTotalPointsDesc().stream()
                .map(PointsAccountDto::from)
                .toList();
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
        Set<Integer> alreadyEarned = userBadgeRepository.findByUser_Id(user.getId()).stream()
                .map(userBadge -> userBadge.getBadge().getId())
                .collect(Collectors.toSet());
        List<UserBadgeEntity> toSave = badgeRepository
                .findByActiveTrueAndRequiredPointsLessThanEqualOrderByRequiredPointsAsc(totalPoints).stream()
                .filter(badge -> !alreadyEarned.contains(badge.getId()))
                .map(badge -> {
                    UserBadgeEntity earned = new UserBadgeEntity();
                    earned.setUser(user);
                    earned.setBadge(badge);
                    earned.setEarnedAt(LocalDateTime.now());
                    return earned;
                })
                .toList();
        if (!toSave.isEmpty()) {
            userBadgeRepository.saveAll(toSave);
        }
    }

    private String resolveLevel(int points) {
        if (points >= 2000) {
            return "LEGEND";
        }
        if (points >= 500) {
            return "SUPERFAN";
        }
        if (points >= 100) {
            return "FAN";
        }
        return "ROOKIE";
    }
}
