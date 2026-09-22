package mariano.projects.appVillaSanMartin.controllers;

import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.StreamSupport;

import org.springframework.context.ApplicationContext;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.support.Repositories;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonMappingException;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import mariano.projects.appVillaSanMartin.entities.BadgeEntity;
import mariano.projects.appVillaSanMartin.entities.BenefitEntity;
import mariano.projects.appVillaSanMartin.entities.CanteenInfoEntity;
import mariano.projects.appVillaSanMartin.entities.CanteenOrderEntity;
import mariano.projects.appVillaSanMartin.entities.CanteenOrderItemEntity;
import mariano.projects.appVillaSanMartin.entities.CartEntity;
import mariano.projects.appVillaSanMartin.entities.CartItemEntity;
import mariano.projects.appVillaSanMartin.entities.CommentEntity;
import mariano.projects.appVillaSanMartin.entities.CouponEntity;
import mariano.projects.appVillaSanMartin.entities.FavoriteNewsEntity;
import mariano.projects.appVillaSanMartin.entities.FavoriteProductEntity;
import mariano.projects.appVillaSanMartin.entities.GalleryEntity;
import mariano.projects.appVillaSanMartin.entities.MatchPredictionEntity;
import mariano.projects.appVillaSanMartin.entities.MembershipEntity;
import mariano.projects.appVillaSanMartin.entities.MembershipFeeEntity;
import mariano.projects.appVillaSanMartin.entities.MembershipTypeEntity;
import mariano.projects.appVillaSanMartin.entities.NewsCategoryEntity;
import mariano.projects.appVillaSanMartin.entities.NewsEntity;
import mariano.projects.appVillaSanMartin.entities.NotificationEntity;
import mariano.projects.appVillaSanMartin.entities.PaymentRecordEntity;
import mariano.projects.appVillaSanMartin.entities.PhotoEntity;
import mariano.projects.appVillaSanMartin.entities.PlayerStatsEntity;
import mariano.projects.appVillaSanMartin.entities.PointsAccountEntity;
import mariano.projects.appVillaSanMartin.entities.PointsTransactionEntity;
import mariano.projects.appVillaSanMartin.entities.PollEntity;
import mariano.projects.appVillaSanMartin.entities.PollOptionEntity;
import mariano.projects.appVillaSanMartin.entities.PollVoteEntity;
import mariano.projects.appVillaSanMartin.entities.ProductCategoryEntity;
import mariano.projects.appVillaSanMartin.entities.ProductEntity;
import mariano.projects.appVillaSanMartin.entities.ProductVariantEntity;
import mariano.projects.appVillaSanMartin.entities.PurchaseOrderEntity;
import mariano.projects.appVillaSanMartin.entities.ReactionEntity;
import mariano.projects.appVillaSanMartin.entities.ReservationEntity;
import mariano.projects.appVillaSanMartin.entities.RewardEntity;
import mariano.projects.appVillaSanMartin.entities.RewardRedemptionEntity;
import mariano.projects.appVillaSanMartin.entities.ShopOrderEntity;
import mariano.projects.appVillaSanMartin.entities.ShopOrderItemEntity;
import mariano.projects.appVillaSanMartin.entities.StaffEntity;
import mariano.projects.appVillaSanMartin.entities.TeamEntity;
import mariano.projects.appVillaSanMartin.entities.TicketTypeEntity;
import mariano.projects.appVillaSanMartin.entities.TriviaAttemptEntity;
import mariano.projects.appVillaSanMartin.entities.TriviaEntity;
import mariano.projects.appVillaSanMartin.entities.TriviaOptionEntity;
import mariano.projects.appVillaSanMartin.entities.TriviaQuestionEntity;
import mariano.projects.appVillaSanMartin.entities.UserBadgeEntity;
import mariano.projects.appVillaSanMartin.entities.UserEntity;
import mariano.projects.appVillaSanMartin.entities.UserPreferencesEntity;
import mariano.projects.appVillaSanMartin.entities.VideoEntity;

@RestController
@RequestMapping("/api/admin/resources")
public class AdminResourceController {
    private final Map<String, ResourceDefinition> resources;
    private final Repositories repositories;
    private final ObjectMapper objectMapper;
    private final EntityManager entityManager;

    public AdminResourceController(ApplicationContext applicationContext, ObjectMapper objectMapper, EntityManager entityManager) {
        this.repositories = new Repositories(applicationContext);
        this.objectMapper = objectMapper;
        this.entityManager = entityManager;
        this.resources = buildResources();
    }

    @GetMapping
    public List<ResourceInfo> getResources() {
        return resources.entrySet().stream()
                .map((entry) -> new ResourceInfo(entry.getKey(), entry.getValue().label(), entry.getValue().description()))
                .toList();
    }

    @GetMapping("/{resource}")
    public List<Object> list(@PathVariable String resource) {
        CrudRepository<Object, Integer> repository = repositoryFor(resource);
        return StreamSupport.stream(repository.findAll().spliterator(), false)
                .sorted(Comparator.comparingInt(this::readId))
                .toList();
    }

    @GetMapping("/{resource}/{id}")
    public Object get(@PathVariable String resource, @PathVariable Integer id) {
        return repositoryFor(resource).findById(id)
                .orElseThrow(() -> notFound(resource));
    }

    @PostMapping("/{resource}")
    @Transactional
    public Object create(@PathVariable String resource, @RequestBody Map<String, Object> body) {
        Class<?> entityType = definition(resource).entityType();
        Object entity;
        try {
            entity = objectMapper.convertValue(body, entityType);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "JSON incompatible con el recurso", ex);
        }
        Object saved = repositoryFor(resource).save(entity);
        entityManager.flush();
        return saved;
    }

    @PutMapping("/{resource}/{id}")
    @Transactional
    public Object update(@PathVariable String resource, @PathVariable Integer id, @RequestBody Map<String, Object> body) {
        Object entity = repositoryFor(resource).findById(id)
                .orElseThrow(() -> notFound(resource));
        try {
            objectMapper.updateValue(entity, body);
        } catch (JsonMappingException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "JSON incompatible con el recurso", ex);
        }
        Object saved = repositoryFor(resource).save(entity);
        entityManager.flush();
        return saved;
    }

    @DeleteMapping("/{resource}/{id}")
    @Transactional
    public void delete(@PathVariable String resource, @PathVariable Integer id) {
        CrudRepository<Object, Integer> repository = repositoryFor(resource);
        if (!repository.existsById(id)) {
            throw notFound(resource);
        }
        repository.deleteById(id);
    }

    private ResourceDefinition definition(String resource) {
        ResourceDefinition definition = resources.get(resource);
        if (definition == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Recurso admin no encontrado");
        }
        return definition;
    }

    @SuppressWarnings("unchecked")
    private CrudRepository<Object, Integer> repositoryFor(String resource) {
        Class<?> entityType = definition(resource).entityType();
        return (CrudRepository<Object, Integer>) repositories.getRepositoryFor(entityType)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Repositorio no encontrado"));
    }

    private int readId(Object entity) {
        Object id = entityManager.getEntityManagerFactory().getPersistenceUnitUtil().getIdentifier(entity);
        return id instanceof Number number ? number.intValue() : Integer.MAX_VALUE;
    }

    private ResponseStatusException notFound(String resource) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, "Registro no encontrado en " + resource);
    }

    private Map<String, ResourceDefinition> buildResources() {
        Map<String, ResourceDefinition> map = new LinkedHashMap<>();
        put(map, "teams", "Equipos", "Clubes/equipos y datos institucionales", TeamEntity.class);
        put(map, "staff", "Cuerpo tecnico", "Entrenadores, asistentes y staff", StaffEntity.class);
        put(map, "players-stats", "Estadisticas jugadores", "Numeros de temporada por jugador", PlayerStatsEntity.class);
        put(map, "ticket-types", "Entradas", "Tipos de entrada por partido", TicketTypeEntity.class);
        put(map, "reservations", "Reservas", "Reservas de entradas", ReservationEntity.class);
        put(map, "purchase-orders", "Ordenes entradas", "Compras/reservas de tickets", PurchaseOrderEntity.class);
        put(map, "payment-records", "Pagos", "Registros de pago", PaymentRecordEntity.class);
        put(map, "product-categories", "Categorias tienda", "Rubros de productos", ProductCategoryEntity.class);
        put(map, "products", "Productos tienda", "Productos, fotos y precios", ProductEntity.class);
        put(map, "product-variants", "Variantes tienda", "Talles/variantes y stock", ProductVariantEntity.class);
        put(map, "coupons", "Cupones", "Codigos de descuento", CouponEntity.class);
        put(map, "carts", "Carritos", "Carritos de usuarios", CartEntity.class);
        put(map, "cart-items", "Items carrito", "Lineas de carrito", CartItemEntity.class);
        put(map, "shop-orders", "Pedidos tienda", "Ordenes de compra de tienda", ShopOrderEntity.class);
        put(map, "shop-order-items", "Items pedidos tienda", "Lineas de pedidos de tienda", ShopOrderItemEntity.class);
        put(map, "favorite-products", "Favoritos tienda", "Productos favoritos de usuarios", FavoriteProductEntity.class);
        put(map, "news-categories", "Categorias noticias", "Rubros de noticias", NewsCategoryEntity.class);
        put(map, "news", "Noticias", "Notas, portada, contenido e imagenes", NewsEntity.class);
        put(map, "favorite-news", "Noticias favoritas", "Favoritos de noticias", FavoriteNewsEntity.class);
        put(map, "galleries", "Galerias", "Albumes multimedia", GalleryEntity.class);
        put(map, "photos", "Fotos", "Imagenes de galerias", PhotoEntity.class);
        put(map, "videos", "Videos", "Videos, entrevistas y highlights", VideoEntity.class);
        put(map, "cantina-info", "Info cantina", "Horarios, contacto y estado abierto", CanteenInfoEntity.class);
        put(map, "cantina-orders", "Pedidos cantina", "Ordenes de la cantina", CanteenOrderEntity.class);
        put(map, "cantina-order-items", "Items pedidos cantina", "Lineas de pedidos de cantina", CanteenOrderItemEntity.class);
        put(map, "membership-types", "Tipos de membresia", "Planes y precios de socios", MembershipTypeEntity.class);
        put(map, "memberships", "Membresias", "Socios activos e historial", MembershipEntity.class);
        put(map, "membership-fees", "Cuotas", "Cuotas de socios", MembershipFeeEntity.class);
        put(map, "benefits", "Beneficios", "Beneficios para socios", BenefitEntity.class);
        put(map, "notifications", "Notificaciones", "Mensajes a usuarios", NotificationEntity.class);
        put(map, "user-preferences", "Preferencias", "Preferencias de usuarios", UserPreferencesEntity.class);
        put(map, "points-accounts", "Cuentas puntos", "Saldos de gamificacion", PointsAccountEntity.class);
        put(map, "points-transactions", "Movimientos puntos", "Historial de puntos", PointsTransactionEntity.class);
        put(map, "badges", "Insignias", "Logros disponibles", BadgeEntity.class);
        put(map, "user-badges", "Insignias usuarios", "Logros obtenidos por usuarios", UserBadgeEntity.class);
        put(map, "rewards", "Premios", "Catalogo de recompensas", RewardEntity.class);
        put(map, "reward-redemptions", "Canjes", "Canjes de premios", RewardRedemptionEntity.class);
        put(map, "predictions", "Predicciones", "Pronosticos de partidos", MatchPredictionEntity.class);
        put(map, "trivias", "Trivias", "Trivias disponibles", TriviaEntity.class);
        put(map, "trivia-questions", "Preguntas trivia", "Preguntas de trivias", TriviaQuestionEntity.class);
        put(map, "trivia-options", "Opciones trivia", "Opciones de respuesta", TriviaOptionEntity.class);
        put(map, "trivia-attempts", "Intentos trivia", "Participaciones de usuarios", TriviaAttemptEntity.class);
        put(map, "polls", "Encuestas", "Encuestas y votaciones", PollEntity.class);
        put(map, "poll-options", "Opciones encuesta", "Opciones de encuestas", PollOptionEntity.class);
        put(map, "poll-votes", "Votos encuesta", "Votos emitidos", PollVoteEntity.class);
        put(map, "comments", "Comentarios", "Comentarios de comunidad", CommentEntity.class);
        put(map, "reactions", "Reacciones", "Reacciones de usuarios", ReactionEntity.class);
        put(map, "users", "Usuarios", "Usuarios, roles y datos de cuenta", UserEntity.class);
        return map;
    }

    private void put(Map<String, ResourceDefinition> map, String key, String label, String description, Class<?> entityType) {
        if (repositories.hasRepositoryFor(entityType)) {
            map.put(key, new ResourceDefinition(label, description, entityType));
        }
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public void handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "No se puede aplicar el cambio porque el registro esta relacionado con otros datos",
                ex);
    }

    public record ResourceInfo(String key, String label, String description) {
    }

    private record ResourceDefinition(String label, String description, Class<?> entityType) {
    }
}
