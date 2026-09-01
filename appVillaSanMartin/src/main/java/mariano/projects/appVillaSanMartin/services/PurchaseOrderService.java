package mariano.projects.appVillaSanMartin.services;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.common.BitMatrix;

import mariano.projects.appVillaSanMartin.entities.PurchaseOrderEntity;
import mariano.projects.appVillaSanMartin.entities.PurchaseOrderStatus;
import mariano.projects.appVillaSanMartin.entities.ReservationEntity;
import mariano.projects.appVillaSanMartin.entities.ReservationStatus;
import mariano.projects.appVillaSanMartin.models.responses.QrValidationResponse;
import mariano.projects.appVillaSanMartin.repositories.PurchaseOrderRepository;

import mariano.projects.appVillaSanMartin.repositories.ReservationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Service
public class PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final mariano.projects.appVillaSanMartin.repositories.ReservationRepository reservationRepository;

    public PurchaseOrderService(
            PurchaseOrderRepository purchaseOrderRepository,
            ReservationRepository reservationRepository) {
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.reservationRepository = reservationRepository;
    }

    private PurchaseOrderEntity processPaymentConfirmation(PurchaseOrderEntity order) {
        String entryCode = UUID.randomUUID().toString();

        try {
            QRCodeWriter writer = new QRCodeWriter();

            BitMatrix matrix = writer.encode(
                    entryCode,
                    BarcodeFormat.QR_CODE,
                    300,
                    300);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();

            MatrixToImageWriter.writeToStream(
                    matrix,
                    "PNG",
                    baos);

            String base64 = Base64.getEncoder()
                    .encodeToString(baos.toByteArray());

            order.setEntryCode(entryCode);
            order.setQrData("data:image/png;base64," + base64);

        } catch (Exception e) {
            throw new RuntimeException(
                    "Error generando QR",
                    e);
        }

        order.setStatus(PurchaseOrderStatus.PAID);
        order.setPaidAt(LocalDateTime.now());

        ReservationEntity reservation = order.getReservation();

        if (reservation != null) {
            reservation.setStatus(ReservationStatus.CONFIRMED);
            reservationRepository.save(reservation);
        }

        return purchaseOrderRepository.save(order);
    }

    @Transactional
    public PurchaseOrderEntity createOrder(int userId, int reservationId) {

        ReservationEntity reservation = reservationRepository
                .findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        if (reservation.getUser().getId() != userId) {
            throw new RuntimeException("La reserva no pertenece al usuario");
        }

        if (reservation.getStatus() != ReservationStatus.PENDING) {
            throw new RuntimeException("La reserva no está pendiente");
        }

        BigDecimal unitPrice = reservation
                .getTicketType()
                .getPrice();

        BigDecimal totalAmount = unitPrice.multiply(
                BigDecimal.valueOf(reservation.getQuantity()));

        PurchaseOrderEntity order = new PurchaseOrderEntity();

        order.setUser(reservation.getUser());
        order.setTicketType(reservation.getTicketType());
        order.setReservation(reservation);
        order.setQuantity(reservation.getQuantity());
        order.setUnitPrice(unitPrice);
        order.setTotalAmount(totalAmount);
        order.setStatus(PurchaseOrderStatus.PENDING_PAYMENT);

        return purchaseOrderRepository.save(order);
    }

    @Transactional
    public PurchaseOrderEntity confirmPaymentFromWebhook(int orderId) {

        PurchaseOrderEntity order = purchaseOrderRepository
                .findById(orderId)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));

        // Webhooks duplicados: no volver a generar QR
        if (order.getStatus() == PurchaseOrderStatus.PAID) {
            return order;
        }

        if (order.getStatus() != PurchaseOrderStatus.PENDING_PAYMENT) {
            throw new RuntimeException(
                    "La orden no está pendiente de pago");
        }
        return processPaymentConfirmation(order);
    }

    @Transactional
    public PurchaseOrderEntity confirmPayment(int orderId, int userId) {

        PurchaseOrderEntity order = purchaseOrderRepository
                .findById(orderId)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));

        if (order.getUser().getId() != userId) {
            throw new RuntimeException("La orden no pertenece al usuario");
        }

        if (order.getStatus() != PurchaseOrderStatus.PENDING_PAYMENT) {
            throw new RuntimeException(
                    "La orden no está pendiente de pago");
        }

        return processPaymentConfirmation(order);
    }

    @Transactional(readOnly = true)
    public PurchaseOrderEntity getOrderById(int id, int userId) {
        PurchaseOrderEntity order = purchaseOrderRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));

        if (order.getUser().getId() != userId) {
            throw new RuntimeException("La orden no pertenece al usuario");
        }

        return order;
    }

    @Transactional(readOnly = true)
    public List<PurchaseOrderEntity> getMyOrders(Long userId) {
        return purchaseOrderRepository.findByUserId(userId);
    }

    @Transactional
    public QrValidationResponse validateQr(String entryCode) {

        PurchaseOrderEntity order = purchaseOrderRepository
                .findByEntryCode(entryCode)
                .orElse(null);

        if (order == null) {
            return new QrValidationResponse(
                    false,
                    "Código inválido",
                    null,
                    null);
        }

        if (order.getStatus() == PurchaseOrderStatus.USED) {
            return new QrValidationResponse(
                    false,
                    "Ya utilizada",
                    null,
                    null);
        }

        if (order.getStatus() != PurchaseOrderStatus.PAID) {
            return new QrValidationResponse(
                    false,
                    "No habilitada",
                    null,
                    null);
        }

        order.setStatus(PurchaseOrderStatus.USED);
        order.setUsedAt(LocalDateTime.now());

        purchaseOrderRepository.save(order);

        return new QrValidationResponse(
                true,
                null,
                order.getTicketType().getName(),
                order.getUser().getName());
    }
}