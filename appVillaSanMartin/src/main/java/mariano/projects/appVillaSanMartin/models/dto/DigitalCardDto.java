package mariano.projects.appVillaSanMartin.models.dto;

import java.time.LocalDateTime;

import mariano.projects.appVillaSanMartin.entities.MembershipEntity;

public record DigitalCardDto(
        String memberNumber,
        String fullName,
        String name,
        String surname,
        MembershipTypeDto type,
        String typeName,
        String status,
        LocalDateTime joinedAt) {

    public static DigitalCardDto from(MembershipEntity e) {
        if (e == null) {
            return null;
        }
        MembershipTypeDto type = MembershipTypeDto.from(e.getMembershipType());
        return new DigitalCardDto(
                e.getMemberNumber(),
                e.getFullName(),
                e.getUser() != null ? e.getUser().getName() : null,
                e.getUser() != null ? e.getUser().getSurname() : null,
                type,
                e.getMembershipType() != null ? e.getMembershipType().getName() : null,
                e.getStatus(),
                e.getJoinedAt());
    }
}
