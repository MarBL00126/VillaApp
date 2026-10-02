package mariano.projects.appVillaSanMartin.models.dto;

import java.util.List;

import mariano.projects.appVillaSanMartin.entities.CartEntity;

public record CartDto(
        int id,
        List<CartItemDto> items) {

    public static CartDto from(CartEntity e) {
        if (e == null) return null;
        List<CartItemDto> items = e.getItems() == null
                ? List.of()
                : e.getItems().stream().map(CartItemDto::from).toList();
        return new CartDto(e.getId(), items);
    }
}
