package mariano.projects.appVillaSanMartin.models.dto;

import mariano.projects.appVillaSanMartin.entities.CanteenInfoEntity;

public record CanteenInfoDto(
        int id,
        String address,
        String phone,
        String email,
        String schedule,
        String paymentMethods,
        String mapsUrl,
        boolean isOpen) {

    public static CanteenInfoDto from(CanteenInfoEntity e) {
        if (e == null) return null;
        return new CanteenInfoDto(
                e.getId(),
                e.getAddress(),
                e.getPhone(),
                e.getEmail(),
                e.getSchedule(),
                e.getPaymentMethods(),
                e.getMapsUrl(),
                Boolean.TRUE.equals(e.getIsOpen()));
    }
}
