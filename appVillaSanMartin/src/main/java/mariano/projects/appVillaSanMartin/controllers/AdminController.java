package mariano.projects.appVillaSanMartin.controllers;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import mariano.projects.appVillaSanMartin.entities.CanteenMenuCategoryEntity;
import mariano.projects.appVillaSanMartin.entities.CanteenMenuItemEntity;
import mariano.projects.appVillaSanMartin.entities.MatchEntity;
import mariano.projects.appVillaSanMartin.entities.PlayerEntity;
import mariano.projects.appVillaSanMartin.entities.TeamEntity;
import mariano.projects.appVillaSanMartin.repositories.CanteenMenuCategoryRepository;
import mariano.projects.appVillaSanMartin.repositories.CanteenMenuItemRepository;
import mariano.projects.appVillaSanMartin.repositories.MatchRepository;
import mariano.projects.appVillaSanMartin.repositories.PlayerRepository;
import mariano.projects.appVillaSanMartin.repositories.TeamRepository;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final PlayerRepository playerRepository;
    private final MatchRepository matchRepository;
    private final TeamRepository teamRepository;
    private final CanteenMenuCategoryRepository categoryRepository;
    private final CanteenMenuItemRepository menuItemRepository;

    public AdminController(
            PlayerRepository playerRepository,
            MatchRepository matchRepository,
            TeamRepository teamRepository,
            CanteenMenuCategoryRepository categoryRepository,
            CanteenMenuItemRepository menuItemRepository) {
        this.playerRepository = playerRepository;
        this.matchRepository = matchRepository;
        this.teamRepository = teamRepository;
        this.categoryRepository = categoryRepository;
        this.menuItemRepository = menuItemRepository;
    }

    @GetMapping("/dashboard")
    public Map<String, Long> dashboard() {
        return Map.of(
                "players", playerRepository.count(),
                "matches", matchRepository.count(),
                "menuItems", menuItemRepository.count(),
                "menuCategories", categoryRepository.count());
    }

    @GetMapping("/players")
    public List<PlayerEntity> getPlayers() {
        return playerRepository.findAll();
    }

    @PostMapping("/players")
    public PlayerEntity createPlayer(@RequestBody PlayerRequest body) {
        return playerRepository.save(applyPlayer(new PlayerEntity(), body));
    }

    @PutMapping("/players/{id}")
    public PlayerEntity updatePlayer(@PathVariable int id, @RequestBody PlayerRequest body) {
        PlayerEntity player = playerRepository.findById(id)
                .orElseThrow(() -> notFound("Jugador no encontrado"));
        return playerRepository.save(applyPlayer(player, body));
    }

    @PutMapping("/players/{id}/active")
    public PlayerEntity setPlayerActive(@PathVariable int id, @RequestBody ActiveRequest body) {
        PlayerEntity player = playerRepository.findById(id)
                .orElseThrow(() -> notFound("Jugador no encontrado"));
        player.setActive(Boolean.TRUE.equals(body.active()));
        return playerRepository.save(player);
    }

    @GetMapping("/matches")
    public List<MatchEntity> getMatches() {
        return matchRepository.findAll();
    }

    @PostMapping("/matches")
    public MatchEntity createMatch(@RequestBody MatchRequest body) {
        return matchRepository.save(applyMatch(new MatchEntity(), body));
    }

    @PutMapping("/matches/{id}")
    public MatchEntity updateMatch(@PathVariable int id, @RequestBody MatchRequest body) {
        MatchEntity match = matchRepository.findById(id)
                .orElseThrow(() -> notFound("Partido no encontrado"));
        return matchRepository.save(applyMatch(match, body));
    }

    @DeleteMapping("/matches/{id}")
    public void deleteMatch(@PathVariable int id) {
        if (!matchRepository.existsById(id)) {
            throw notFound("Partido no encontrado");
        }
        matchRepository.deleteById(id);
    }

    @GetMapping("/cantina/categories")
    public List<CanteenMenuCategoryEntity> getCantinaCategories() {
        return categoryRepository.findAllByOrderBySortOrder();
    }

    @PostMapping("/cantina/categories")
    public CanteenMenuCategoryEntity createCantinaCategory(@RequestBody CategoryRequest body) {
        return categoryRepository.save(applyCategory(new CanteenMenuCategoryEntity(), body));
    }

    @PutMapping("/cantina/categories/{id}")
    public CanteenMenuCategoryEntity updateCantinaCategory(@PathVariable int id, @RequestBody CategoryRequest body) {
        CanteenMenuCategoryEntity category = categoryRepository.findById(id)
                .orElseThrow(() -> notFound("Categoria no encontrada"));
        return categoryRepository.save(applyCategory(category, body));
    }

    @GetMapping("/cantina/items")
    public List<CanteenMenuItemEntity> getCantinaItems() {
        return menuItemRepository.findAll();
    }

    @PostMapping("/cantina/items")
    public CanteenMenuItemEntity createCantinaItem(@RequestBody MenuItemRequest body) {
        return menuItemRepository.save(applyMenuItem(new CanteenMenuItemEntity(), body));
    }

    @PutMapping("/cantina/items/{id}")
    public CanteenMenuItemEntity updateCantinaItem(@PathVariable int id, @RequestBody MenuItemRequest body) {
        CanteenMenuItemEntity item = menuItemRepository.findById(id)
                .orElseThrow(() -> notFound("Item de menu no encontrado"));
        return menuItemRepository.save(applyMenuItem(item, body));
    }

    @PutMapping("/cantina/items/{id}/available")
    public CanteenMenuItemEntity setMenuItemAvailable(@PathVariable int id, @RequestBody AvailableRequest body) {
        CanteenMenuItemEntity item = menuItemRepository.findById(id)
                .orElseThrow(() -> notFound("Item de menu no encontrado"));
        item.setAvailable(Boolean.TRUE.equals(body.available()));
        return menuItemRepository.save(item);
    }

    private PlayerEntity applyPlayer(PlayerEntity player, PlayerRequest body) {
        player.setName(required(body.name(), "Nombre requerido"));
        player.setSurname(required(body.surname(), "Apellido requerido"));
        player.setPosition(required(body.position(), "Posicion requerida"));
        player.setShirtNumber(body.shirtNumber() == null ? 0 : body.shirtNumber());
        player.setHeight(body.height() == null ? 0 : body.height());
        player.setNationality(required(body.nationality(), "Nacionalidad requerida"));
        player.setBirthDate(body.birthDate() == null ? LocalDate.now() : body.birthDate());
        player.setBiography(emptyToNull(body.biography()));
        player.setImageUrl(emptyToNull(body.imageUrl()));
        player.setActive(body.active() == null || body.active());
        player.setTeam(findTeam(body.teamId()));
        return player;
    }

    private MatchEntity applyMatch(MatchEntity match, MatchRequest body) {
        match.setMatchDate(body.matchDate() == null ? LocalDateTime.now() : body.matchDate());
        match.setLocal(Boolean.TRUE.equals(body.isLocal()));
        match.setOpponent(required(body.opponent(), "Rival requerido"));
        match.setTeamPoints(body.teamPoints() == null ? 0 : body.teamPoints());
        match.setOpponentPoints(body.opponentPoints() == null ? 0 : body.opponentPoints());
        match.setTeam(findTeam(body.teamId()));
        return match;
    }

    private CanteenMenuCategoryEntity applyCategory(CanteenMenuCategoryEntity category, CategoryRequest body) {
        category.setName(required(body.name(), "Nombre requerido"));
        category.setSortOrder(body.sortOrder() == null ? 0 : body.sortOrder());
        return category;
    }

    private CanteenMenuItemEntity applyMenuItem(CanteenMenuItemEntity item, MenuItemRequest body) {
        CanteenMenuCategoryEntity category = categoryRepository.findById(body.categoryId())
                .orElseThrow(() -> notFound("Categoria no encontrada"));
        item.setCategory(category);
        item.setName(required(body.name(), "Nombre requerido"));
        item.setDescription(emptyToNull(body.description()));
        item.setPrice(body.price() == null ? BigDecimal.ZERO : body.price());
        item.setImageUrl(emptyToNull(body.imageUrl()));
        item.setAvailable(body.available() == null || body.available());
        return item;
    }

    private TeamEntity findTeam(Integer teamId) {
        if (teamId != null) {
            return teamRepository.findById(teamId)
                    .orElseThrow(() -> notFound("Equipo no encontrado"));
        }
        return teamRepository.findByPrimaryTeamTrue()
                .orElseGet(() -> teamRepository.findAll().stream().findFirst()
                        .orElseThrow(() -> notFound("No hay equipos cargados")));
    }

    private String required(String value, String message) {
        String clean = emptyToNull(value);
        if (clean == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
        return clean;
    }

    private String emptyToNull(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        return value.trim();
    }

    private ResponseStatusException notFound(String message) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, message);
    }

    public record PlayerRequest(
            String name,
            String surname,
            String position,
            Integer shirtNumber,
            Float height,
            String nationality,
            LocalDate birthDate,
            Integer teamId,
            String biography,
            String imageUrl,
            Boolean active) {
    }

    public record MatchRequest(
            LocalDateTime matchDate,
            Boolean isLocal,
            String opponent,
            Integer teamPoints,
            Integer opponentPoints,
            Integer teamId) {
    }

    public record CategoryRequest(String name, Integer sortOrder) {
    }

    public record MenuItemRequest(
            Integer categoryId,
            String name,
            String description,
            BigDecimal price,
            String imageUrl,
            Boolean available) {
    }

    public record ActiveRequest(Boolean active) {
    }

    public record AvailableRequest(Boolean available) {
    }
}
