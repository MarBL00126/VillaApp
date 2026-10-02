package mariano.projects.appVillaSanMartin.models.dto;

import java.time.LocalDateTime;

import mariano.projects.appVillaSanMartin.entities.MembershipEntity;

public record MembershipDto(
        int id,
        UserSummaryDto user,
        MembershipTypeDto membershipType,
        MembershipTypeDto type,
        String status,
        String memberNumber,
        LocalDateTime joinedAt,
        LocalDateTime createdAt,
        LocalDateTime expiresAt,
        String fullName) {

    public static MembershipDto from(MembershipEntity e) {
        if (e == null) {
            return null;
        }
        MembershipTypeDto membershipType = MembershipTypeDto.from(e.getMembershipType());
        return new MembershipDto(
                e.getId(),
                UserSummaryDto.from(e.getUser()),
                membershipType,
                membershipType,
                e.getStatus(),
                e.getMemberNumber(),
                e.getJoinedAt(),
                e.getJoinedAt(),
                e.getExpiresAt(),
                e.getFullName());
    }
}
