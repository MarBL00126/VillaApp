package mariano.projects.appVillaSanMartin.controllers;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
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
import mariano.projects.appVillaSanMartin.entities.CanteenOrderEntity;
import mariano.projects.appVillaSanMartin.entities.AppConfigEntity;
import mariano.projects.appVillaSanMartin.entities.MatchEntity;
import mariano.projects.appVillaSanMartin.entities.MembershipEntity;
import mariano.projects.appVillaSanMartin.entities.ProductVariantEntity;
import mariano.projects.appVillaSanMartin.entities.PlayerEntity;
import mariano.projects.appVillaSanMartin.entities.TeamEntity;
import mariano.projects.appVillaSanMartin.models.dto.AppConfigDto;
import mariano.projects.appVillaSanMartin.models.dto.CanteenMenuCategoryDto;
import mariano.projects.appVillaSanMartin.models.dto.CanteenMenuItemDto;
import mariano.projects.appVillaSanMartin.models.dto.CanteenOrderDto;
import mariano.projects.appVillaSanMartin.models.dto.MatchDto;
import mariano.projects.appVillaSanMartin.models.dto.MembershipDto;
import mariano.projects.appVillaSanMartin.models.dto.PlayerDto;
import mariano.projects.appVillaSanMartin.models.dto.ProductDto;
import mariano.projects.appVillaSanMartin.models.dto.ProductVariantDto;
import mariano.projects.appVillaSanMartin.repositories.AppConfigRepository;
import mariano.projects.appVillaSanMartin.repositories.CanteenOrderRepository;
import mariano.projects.appVillaSanMartin.repositories.CanteenMenuCategoryRepository;
import mariano.projects.appVillaSanMartin.repositories.CanteenMenuItemRepository;
import mariano.projects.appVillaSanMartin.repositories.MatchRepository;
import mariano.projects.appVillaSanMartin.repositories.MembershipFeeRepository;
import mariano.projects.appVillaSanMartin.repositories.MembershipRepository;
import mariano.projects.appVillaSanMartin.repositories.PlayerRepository;
import mariano.projects.appVillaSanMartin.repositories.ProductRepository;
import mariano.projects.appVillaSanMartin.repositories.ProductVariantRepository;
import mariano.projects.appVillaSanMartin.repositories.TeamRepository;
import mariano.projects.appVillaSanMartin.services.CacheMaintenanceService;

@RestController
@RequestMapping("/api/admin")
@Transactional
public class AdminController {
    private final PlayerRepository playerRepository;
    private final MatchRepository matchRepository;
    private final TeamRepository teamRepository;
    private final CanteenMenuCategoryRepository categoryRepository;
    private final CanteenMenuItemRepository menuItemRepository;
    private final CanteenOrderRepository canteenOrderRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final MembershipRepository membershipRepository;
    private final MembershipFeeRepository membershipFeeRepository;
    private final AppConfigRepository appConfigRepository;
    private final CacheMaintenanceService cacheMaintenance;

    public AdminController(
            PlayerRepository playerRepository,
            MatchRepository matchRepository,
            TeamRepository teamRepository,
            CanteenMenuCategoryRepository categoryRepository,
            CanteenMenuItemRepository menuItemRepository,
            CanteenOrderRepository canteenOrderRepository,
            ProductRepository productRepository,
            ProductVariantRepository productVariantRepository,
            MembershipRepository membershipRepository,
            MembershipFeeRepository membershipFeeRepository,
            AppConfigRepository appConfigRepository,
            CacheMaintenanceService cacheMaintenance) {
        this.playerRepository = playerRepository;
        this.matchRepository = matchRepository;
        this.teamRepository = teamRepository;
        this.categoryRepository = categoryRepository;
        this.menuItemRepository = menuItemRepository;
        this.canteenOrderRepository = canteenOrderRepository;
        this.productRepository = productRepository;
        this.productVariantRepository = productVariantRepository;
        this.membershipRepository = membershipRepository;
        this.membershipFeeRepository = membershipFeeRepository;
        this.appConfigRepository = appConfigRepository;
        this.cacheMaintenance = cacheMaintenance;
    }

    @GetMapping("/dashboard")
    public Map<String, Long> dashboard() {
        return Map.of(
                "players", playerRepository.count(),
                "matches", matchRepository.count(),
                "menuItems", menuItemRepository.count(),
                "menuCategories", categoryRepository.count());
    }

    @GetMapping("/dashboard/full")
    public Map<String, Long> fullDashboard() {
        long activeMembers = membershipRepository.findAll().stream()
                .filter(member -> "ACTIVE".equalsIgnoreCase(member.getStatus()))
                .count();
        long pendingFees = membershipFeeRepository.findAll().stream()
                .filter(fee -> !"PAID".equalsIgnoreCase(fee.getStatus()))
                .count();
        long ordersToday = canteenOrderRepository.findAll().stream()
                .filter(order -> order.getCreatedAt() != null && order.getCreatedAt().toLocalDate().equals(LocalDate.now()))
                .count();

        return Map.of(
                "players", playerRepository.count(),
                "matches", matchRepository.count(),
                "menuItems", menuItemRepository.count(),
                "menuCategories", categoryRepository.count(),
                "activeMembers", activeMembers,
                "pendingFees", pendingFees,
                "canteenOrdersToday", ordersToday,
                "products", productRepository.count());
    }

    @GetMapping("/players")
    public List<PlayerDto> getPlayers() {
        return playerRepository.findAll().stream().map(PlayerDto::from).toList();
    }

    @PostMapping("/players")
    public PlayerDto createPlayer(@RequestBody PlayerRequest body) {
        PlayerEntity saved = playerRepository.save(applyPlayer(new PlayerEntity(), body));
        cacheMaintenance.evictAll();
        return PlayerDto.from(saved);
    }

    @PutMapping("/players/{id}")
    public PlayerDto updatePlayer(@PathVariable int id, @RequestBody PlayerRequest body) {
        PlayerEntity player = playerRepository.findById(id)
                .orElseThrow(() -> notFound("Jugador no encontrado"));
        PlayerEntity saved = playerRepository.save(applyPlayer(player, body));
        cacheMaintenance.evictAll();
        return PlayerDto.from(saved);
    }

    @PutMapping("/players/{id}/active")
    public PlayerDto setPlayerActive(@PathVariable int id, @RequestBody ActiveRequest body) {
        PlayerEntity player = playerRepository.findById(id)
                .orElseThrow(() -> notFound("Jugador no encontrado"));
        player.setActive(Boolean.TRUE.equals(body.active()));
        PlayerEntity saved = playerRepository.save(player);
        cacheMaintenance.evictAll();
        return PlayerDto.from(saved);
    }

    @GetMapping("/matches")
    public List<MatchDto> getMatches() {
        return matchRepository.findAll().stream().map(MatchDto::from).toList();
    }

    @PostMapping("/matches")
    public MatchDto createMatch(@RequestBody MatchRequest body) {
        MatchEntity saved = matchRepository.save(applyMatch(new MatchEntity(), body));
        cacheMaintenance.evictAll();
        return MatchDto.from(saved);
    }

    @PutMapping("/matches/{id}")
    public MatchDto updateMatch(@PathVariable int id, @RequestBody MatchRequest body) {
        MatchEntity match = matchRepository.findById(id)
                .orElseThrow(() -> notFound("Partido no encontrado"));
        MatchEntity saved = matchRepository.save(applyMatch(match, body));
        cacheMaintenance.evictAll();
        return MatchDto.from(saved);
    }

    @DeleteMapping("/matches/{id}")
    public void deleteMatch(@PathVariable int id) {
        if (!matchRepository.existsById(id)) {
            throw notFound("Partido no encontrado");
        }
        matchRepository.deleteById(id);
        cacheMaintenance.evictAll();
    }

    @GetMapping("/cantina/categories")
    public List<CanteenMenuCategoryDto> getCantinaCategories() {
        return categoryRepository.findAllByOrderBySortOrder().stream().map(CanteenMenuCategoryDto::from).toList();
    }

    @PostMapping("/cantina/categories")
    public CanteenMenuCategoryDto createCantinaCategory(@RequestBody CategoryRequest body) {
        CanteenMenuCategoryEntity saved = categoryRepository.save(applyCategory(new CanteenMenuCategoryEntity(), body));
        cacheMaintenance.evictAll();
        return CanteenMenuCategoryDto.from(saved);
    }

    @PutMapping("/cantina/categories/{id}")
    public CanteenMenuCategoryDto updateCantinaCategory(@PathVariable int id, @RequestBody CategoryRequest body) {
        CanteenMenuCategoryEntity category = categoryRepository.findById(id)
                .orElseThrow(() -> notFound("Categoria no encontrada"));
        CanteenMenuCategoryEntity saved = categoryRepository.save(applyCategory(category, body));
        cacheMaintenance.evictAll();
        return CanteenMenuCategoryDto.from(saved);
    }

    @GetMapping("/cantina/items")
    public List<CanteenMenuItemDto> getCantinaItems() {
        return menuItemRepository.findAll().stream().map(CanteenMenuItemDto::from).toList();
    }

    @PostMapping("/cantina/items")
    public CanteenMenuItemDto createCantinaItem(@RequestBody MenuItemRequest body) {
        CanteenMenuItemEntity saved = menuItemRepository.save(applyMenuItem(new CanteenMenuItemEntity(), body));
        cacheMaintenance.evictAll();
        return CanteenMenuItemDto.from(saved);
    }

    @PutMapping("/cantina/items/{id}")
    public CanteenMenuItemDto updateCantinaItem(@PathVariable int id, @RequestBody MenuItemRequest body) {
        CanteenMenuItemEntity item = menuItemRepository.findById(id)
                .orElseThrow(() -> notFound("Item de menu no encontrado"));
        CanteenMenuItemEntity saved = menuItemRepository.save(applyMenuItem(item, body));
        cacheMaintenance.evictAll();
        return CanteenMenuItemDto.from(saved);
    }

    @PutMapping("/cantina/items/{id}/available")
    public CanteenMenuItemDto setMenuItemAvailable(@PathVariable int id, @RequestBody AvailableRequest body) {
        CanteenMenuItemEntity item = menuItemRepository.findById(id)
                .orElseThrow(() -> notFound("Item de menu no encontrado"));
        item.setAvailable(Boolean.TRUE.equals(body.available()));
        CanteenMenuItemEntity saved = menuItemRepository.save(item);
        cacheMaintenance.evictAll();
        return CanteenMenuItemDto.from(saved);
    }

    @GetMapping("/orders/cantina")
    public List<CanteenOrderDto> getCanteenOrders() {
        return canteenOrderRepository.findAll().stream()
                .sorted((a, b) -> nullSafeDate(b.getCreatedAt()).compareTo(nullSafeDate(a.getCreatedAt())))
                .map(CanteenOrderDto::from)
                .toList();
    }

    @PutMapping("/orders/cantina/{id}/status")
    public CanteenOrderDto updateCanteenOrderStatus(@PathVariable int id, @RequestBody StatusRequest body) {
        CanteenOrderEntity order = canteenOrderRepository.findById(id)
                .orElseThrow(() -> notFound("Pedido de cantina no encontrado"));
        order.setStatus(required(body.status(), "Estado requerido"));
        if ("READY".equalsIgnoreCase(order.getStatus()) && order.getReadyAt() == null) {
            order.setReadyAt(LocalDateTime.now());
        }
        return CanteenOrderDto.from(canteenOrderRepository.save(order));
    }

    @GetMapping("/products")
    public List<ProductDto> getProducts() {
        return productRepository.findAll().stream().map(ProductDto::from).toList();
    }

    @PutMapping("/products/{id}/stock/{variantId}")
    public ProductVariantDto updateProductStock(
            @PathVariable int id,
            @PathVariable int variantId,
            @RequestBody StockRequest body) {
        ProductVariantEntity variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> notFound("Variante no encontrada"));
        if (variant.getProduct() == null || !variant.getProduct().getId().equals(id)) {
            throw notFound("La variante no pertenece al producto indicado");
        }
        variant.setStock(body.stock() == null ? 0 : body.stock());
        ProductVariantEntity saved = productVariantRepository.save(variant);
        cacheMaintenance.evictAll();
        return ProductVariantDto.from(saved);
    }

    @GetMapping("/members")
    public List<MembershipDto> getMembers() {
        return membershipRepository.findAll().stream().map(MembershipDto::from).toList();
    }

    @PutMapping("/members/{id}/status")
    public MembershipDto updateMemberStatus(@PathVariable int id, @RequestBody StatusRequest body) {
        MembershipEntity membership = membershipRepository.findById(id)
                .orElseThrow(() -> notFound("Socio no encontrado"));
        membership.setStatus(required(body.status(), "Estado requerido"));
        return MembershipDto.from(membershipRepository.save(membership));
    }

    @GetMapping("/config")
    public List<AppConfigDto> getConfig() {
        return appConfigRepository.findAll().stream().map(AppConfigDto::from).toList();
    }

    @PutMapping("/config/{key}")
    public AppConfigDto updateConfig(@PathVariable String key, @RequestBody ConfigValueRequest body) {
        AppConfigEntity config = appConfigRepository.findByKey(key)
                .orElseThrow(() -> notFound("Configuracion no encontrada"));
        config.setValue(required(body.value(), "Valor requerido"));
        AppConfigEntity saved = appConfigRepository.save(config);
        cacheMaintenance.evictAll();
        return AppConfigDto.from(saved);
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

    private LocalDateTime nullSafeDate(LocalDateTime date) {
        return date == null ? LocalDateTime.MIN : date;
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

    public record StatusRequest(String status) {
    }

    public record StockRequest(Integer stock) {
    }

    public record ConfigValueRequest(String value) {
    }
}
