package mariano.projects.appVillaSanMartin.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import mariano.projects.appVillaSanMartin.entities.AccessLogEntity;
import mariano.projects.appVillaSanMartin.entities.PressAccreditationEntity;
import mariano.projects.appVillaSanMartin.entities.PurchaseOrderEntity;
import mariano.projects.appVillaSanMartin.entities.PurchaseOrderStatus;
import mariano.projects.appVillaSanMartin.models.requests.AccessScanRequest;
import mariano.projects.appVillaSanMartin.models.responses.AccessLogResponse;
import mariano.projects.appVillaSanMartin.models.responses.AccessScanResponse;
import mariano.projects.appVillaSanMartin.models.responses.AccessSummaryResponse;
import mariano.projects.appVillaSanMartin.repositories.AccessLogRepository;
import mariano.projects.appVillaSanMartin.repositories.PressAccreditationRepository;
import mariano.projects.appVillaSanMartin.repositories.PurchaseOrderRepository;

@Service
@RequiredArgsConstructor
public class AccessControlService {

    private final AccessLogRepository accessLogRepository;
    private final PressAccreditationRepository pressAccreditationRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;

    @Transactional
    public AccessScanResponse scan(AccessScanRequest request) {

        // 1. Buscar QR entre acreditaciones de prensa
        PressAccreditationEntity accreditation =
                pressAccreditationRepository
                        .findByQrCode(request.getQrCode())
                        .orElse(null);

        if (accreditation != null) {
            return processPressAccess(accreditation, request);
        }

        // 2. Si no es prensa, procesar ticket
        return processTicketAccess(request);
    }

    private AccessScanResponse processPressAccess(
            PressAccreditationEntity accreditation,
            AccessScanRequest request) {

        if (!"APPROVED".equals(accreditation.getStatus())) {
            return new AccessScanResponse(
                    false,
                    "INVALID",
                    "La acreditación no está aprobada",
                    accreditation.getJournalistName(),
                    null,
                    accreditation.getGate()
            );
        }

        if (!accreditation.getMatchId().equals(request.getMatchId())) {
            return new AccessScanResponse(
                    false,
                    "WRONG_MATCH",
                    "La acreditación no corresponde a este partido",
                    accreditation.getJournalistName(),
                    null,
                    accreditation.getGate()
            );
        }

        LocalDateTime now = LocalDateTime.now();

        if (accreditation.getValidFrom() != null &&
                now.isBefore(accreditation.getValidFrom())) {

            return new AccessScanResponse(
                    false,
                    "EXPIRED",
                    "La acreditación todavía no está vigente",
                    accreditation.getJournalistName(),
                    null,
                    accreditation.getGate()
            );
        }

        if (accreditation.getValidUntil() != null &&
                now.isAfter(accreditation.getValidUntil())) {

            return new AccessScanResponse(
                    false,
                    "EXPIRED",
                    "La acreditación está vencida",
                    accreditation.getJournalistName(),
                    null,
                    accreditation.getGate()
            );
        }

        return new AccessScanResponse(
                true,
                "OK",
                "Prensa autorizada",
                accreditation.getJournalistName(),
                null,
                accreditation.getGate()
        );
    }

    private AccessScanResponse processTicketAccess(AccessScanRequest request) {

        // 1. Buscar la orden de compra por el código QR (entryCode)
        PurchaseOrderEntity order =
                purchaseOrderRepository
                        .findByEntryCode(request.getQrCode())
                        .orElse(null);

        if (order == null) {
            return new AccessScanResponse(
                    false,
                    "INVALID",
                    "Ticket no encontrado",
                    null,
                    null,
                    request.getGate()
            );
        }

        String holderName = order.getUser().getName() + " " + order.getUser().getSurname();
        String sector     = order.getTicketType().getName();
        Integer matchId   = order.getTicketType().getMatch().getId();

        // 2. Validar que el ticket pertenece al partido correcto
        if (!matchId.equals(request.getMatchId())) {
            saveLog(order.getId(), order.getUser().getId(),
                    request.getMatchId(), request.getGate(),
                    "WRONG_MATCH", request.getDeviceId(),
                    "Partido incorrecto (esperado: " + matchId + ")");

            return new AccessScanResponse(
                    false,
                    "WRONG_MATCH",
                    "El ticket no corresponde a este partido",
                    holderName,
                    sector,
                    request.getGate()
            );
        }

        // 3. Validar el estado de la orden
        if (order.getStatus() == PurchaseOrderStatus.CANCELLED ||
                order.getStatus() == PurchaseOrderStatus.EXPIRED) {

            saveLog(order.getId(), order.getUser().getId(),
                    request.getMatchId(), request.getGate(),
                    "INVALID", request.getDeviceId(),
                    "Orden en estado: " + order.getStatus());

            return new AccessScanResponse(
                    false,
                    "INVALID",
                    "El ticket no es válido (estado: " + order.getStatus() + ")",
                    holderName,
                    sector,
                    request.getGate()
            );
        }

        if (order.getStatus() == PurchaseOrderStatus.PENDING_PAYMENT) {
            saveLog(order.getId(), order.getUser().getId(),
                    request.getMatchId(), request.getGate(),
                    "INVALID", request.getDeviceId(),
                    "Pago pendiente");

            return new AccessScanResponse(
                    false,
                    "INVALID",
                    "El ticket no está pagado",
                    holderName,
                    sector,
                    request.getGate()
            );
        }

        // 4. Detectar uso duplicado (ya ingresó antes con este ticket)
        boolean alreadyUsed = accessLogRepository
                .existsByTicketIdAndStatus(order.getId(), "OK");

        if (alreadyUsed) {
            saveLog(order.getId(), order.getUser().getId(),
                    request.getMatchId(), request.getGate(),
                    "DUPLICATE", request.getDeviceId(),
                    "Ticket ya utilizado");

            return new AccessScanResponse(
                    false,
                    "DUPLICATE",
                    "Este ticket ya fue utilizado",
                    holderName,
                    sector,
                    request.getGate()
            );
        }

        // 5. Acceso válido: registrar log y marcar la orden como USED
        order.setStatus(PurchaseOrderStatus.USED);
        order.setUsedAt(LocalDateTime.now());
        purchaseOrderRepository.save(order);

        saveLog(order.getId(), order.getUser().getId(),
                request.getMatchId(), request.getGate(),
                "OK", request.getDeviceId(), null);

        return new AccessScanResponse(
                true,
                "OK",
                "Acceso permitido",
                holderName,
                sector,
                request.getGate()
        );
    }

    // ─── helpers ────────────────────────────────────────────────────────────

    private void saveLog(Integer ticketId, Integer userId, Integer matchId,
                         String gate, String status, String deviceId, String notes) {
        AccessLogEntity log = new AccessLogEntity();
        log.setTicketId(ticketId);
        log.setUserId(userId);
        log.setMatchId(matchId);
        log.setScannedAt(LocalDateTime.now());
        log.setGate(gate);
        log.setStatus(status);
        log.setDeviceId(deviceId);
        log.setNotes(notes);
        accessLogRepository.save(log);
    }

    // ─── consultas ──────────────────────────────────────────────────────────

    public List<AccessLogResponse> getLogs(Integer matchId) {

        return accessLogRepository
                .findByMatchIdOrderByScannedAtDesc(matchId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public AccessSummaryResponse getSummary(Integer matchId) {

        List<AccessLogEntity> logs =
                accessLogRepository
                        .findByMatchIdOrderByScannedAtDesc(matchId);

        long total = logs.size();

        long ok = logs.stream()
                .filter(log -> "OK".equals(log.getStatus()))
                .count();

        long duplicates = logs.stream()
                .filter(log -> "DUPLICATE".equals(log.getStatus()))
                .count();

        long invalid = logs.stream()
                .filter(log ->
                        "INVALID".equals(log.getStatus()) ||
                        "EXPIRED".equals(log.getStatus()) ||
                        "WRONG_MATCH".equals(log.getStatus()))
                .count();

        return new AccessSummaryResponse(
                total,
                ok,
                duplicates,
                invalid
        );
    }

    private AccessLogResponse toResponse(AccessLogEntity entity) {

        return new AccessLogResponse(
                entity.getId(),
                entity.getTicketId(),
                entity.getUserId(),
                entity.getMatchId(),
                entity.getScannedAt(),
                entity.getGate(),
                entity.getStatus(),
                entity.getDeviceId(),
                entity.getNotes()
        );
    }
}

