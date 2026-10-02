package mariano.projects.appVillaSanMartin.models.dto;

import java.math.BigDecimal;

import mariano.projects.appVillaSanMartin.entities.BenefitEntity;

public record BenefitDto(
        int id,
        String title,
        String description,
        String type,
        BigDecimal discountPct,
        Boolean active) {

    public static BenefitDto from(BenefitEntity e) {
        if (e == null) {
            return null;
        }
        return new BenefitDto(
                e.getId(),
                e.getTitle(),
                e.getDescription(),
                e.getType(),
                e.getDiscountPct(),
                e.getActive());
    }
}
