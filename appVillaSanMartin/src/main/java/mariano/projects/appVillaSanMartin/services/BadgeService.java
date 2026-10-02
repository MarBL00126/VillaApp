package mariano.projects.appVillaSanMartin.services;

import java.util.List;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import mariano.projects.appVillaSanMartin.models.dto.BadgeDto;
import mariano.projects.appVillaSanMartin.models.dto.UserBadgeDto;
import mariano.projects.appVillaSanMartin.repositories.BadgeRepository;
import mariano.projects.appVillaSanMartin.repositories.UserBadgeRepository;

@Service
@RequiredArgsConstructor
public class BadgeService {
    private final BadgeRepository badgeRepository;
    private final UserBadgeRepository userBadgeRepository;

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "badges-public")
    public List<BadgeDto> getAll() {
        return badgeRepository.findByActiveTrueOrderByRequiredPointsAsc().stream()
                .map(BadgeDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<UserBadgeDto> getMyBadges(int userId) {
        return userBadgeRepository.findByUser_IdOrderByEarnedAtDesc(userId).stream()
                .map(UserBadgeDto::from)
                .toList();
    }
}
