package mariano.projects.appVillaSanMartin.models.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import mariano.projects.appVillaSanMartin.entities.MembershipFeeEntity;

public record MembershipFeeDto(
        int id,
        MembershipDto membership,
        int month,
        int year,
        BigDecimal amount,
        String status,
        LocalDate dueDate,
        LocalDateTime paidAt) {

    public static MembershipFeeDto from(MembershipFeeEntity e) {
        if (e == null) {
            return null;
        }
        return new MembershipFeeDto(
                e.getId(),
                MembershipDto.from(e.getMembership()),
                e.getMonth(),
                e.getYear(),
                e.getAmount(),
                e.getStatus(),
                e.getDueDate(),
                e.getPaidAt());
    }
}
