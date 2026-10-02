package mariano.projects.appVillaSanMartin.models.dto;

import java.math.BigDecimal;

import mariano.projects.appVillaSanMartin.entities.MembershipTypeEntity;

public record MembershipTypeDto(
        int id,
        String name,
        BigDecimal monthlyFee,
        BigDecimal annualFee,
        String description,
        Boolean active) {

    public static MembershipTypeDto from(MembershipTypeEntity e) {
        if (e == null) {
            return null;
        }
        return new MembershipTypeDto(
                e.getId(),
                e.getName(),
                e.getMonthlyFee(),
                e.getAnnualFee(),
                e.getDescription(),
                e.getActive());
    }
}
