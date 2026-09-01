package mariano.projects.appVillaSanMartin.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mercadopago.resources.payment.Payment;

import mariano.projects.appVillaSanMartin.entities.PaymentRecordEntity;
import mariano.projects.appVillaSanMartin.entities.PurchaseOrderEntity;
import mariano.projects.appVillaSanMartin.repositories.PaymentRecordRepository;
import mariano.projects.appVillaSanMartin.repositories.PurchaseOrderRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.HexFormat;

@Service
public class WebhookService {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final MercadoPagoService mercadoPagoService;
    private final PurchaseOrderService purchaseOrderService;
    private final PaymentRecordRepository paymentRecordRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;

    @Value("${mercadopago.webhook-secret}")
    private String webhookSecret;

    public WebhookService(
            MercadoPagoService mercadoPagoService,
            PurchaseOrderService purchaseOrderService,
            PaymentRecordRepository paymentRecordRepository,
            PurchaseOrderRepository purchaseOrderRepository) {
        this.mercadoPagoService = mercadoPagoService;
        this.purchaseOrderService = purchaseOrderService;
        this.paymentRecordRepository = paymentRecordRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
    }

    @Transactional
    public void processWebhook(
            String rawBody,
            String xSignature,
            String xRequestId) {

        JsonNode body = parseJson(rawBody);

        String type = body.path("type").asText(null);

        if (!"payment".equals(type)) {
            return;
        }

        String paymentId = body
                .path("data")
                .path("id")
                .asText(null);

        if (paymentId == null || paymentId.isBlank()) {
            throw new RuntimeException(
                    "Webhook sin paymentId");
        }

        validateSignature(
                paymentId,
                xSignature,
                xRequestId);

        processPayment(paymentId);
    }

    private void validateSignature(
            String paymentId,
            String xSignature,
            String xRequestId) {

        if (xSignature == null || xRequestId == null) {
            throw new WebhookSignatureException(
                    "Headers de firma faltantes");
        }

        String timestamp = null;
        String receivedSignature = null;

        String[] parts = xSignature.split(",");

        for (String part : parts) {

            String[] keyValue = part.split("=", 2);

            if (keyValue.length != 2) {
                continue;
            }

            String key = keyValue[0].trim();
            String value = keyValue[1].trim();

            if ("ts".equals(key)) {
                timestamp = value;
            }

            if ("v1".equals(key)) {
                receivedSignature = value;
            }
        }

        if (timestamp == null || receivedSignature == null) {
            throw new WebhookSignatureException(
                    "Formato de x-signature inválido");
        }

        String manifest = "id:" + paymentId +
                ";request-id:" + xRequestId +
                ";ts:" + timestamp +
                ";";

        String calculatedSignature = generateHmacSha256(
                manifest,
                webhookSecret);

        boolean valid = MessageDigest.isEqual(
                calculatedSignature.getBytes(StandardCharsets.UTF_8),
                receivedSignature.getBytes(StandardCharsets.UTF_8));

        if (!valid) {
            throw new WebhookSignatureException(
                    "Firma de Mercado Pago inválida");
        }
    }

    @Transactional
    public void processPayment(String paymentId) {

        Payment payment = mercadoPagoService.getPayment(paymentId);

        if (payment == null) {
            throw new RuntimeException(
                    "Pago no encontrado: " + paymentId);
        }

        String status = payment.getStatus();

        String externalReference = payment.getExternalReference();

        if (externalReference == null) {
            throw new RuntimeException(
                    "El pago no tiene externalReference");
        }

        int orderId;

        try {
            orderId = Integer.parseInt(externalReference);
        } catch (NumberFormatException e) {
            throw new RuntimeException(
                    "externalReference inválido: "
                            + externalReference);
        }

        PurchaseOrderEntity order = purchaseOrderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException(
                        "Orden no encontrada: "
                                + orderId));

        saveOrUpdatePaymentRecord(
                payment,
                order);

        switch (status) {

            case "approved":

                purchaseOrderService
                        .confirmPaymentFromWebhook(orderId);

                break;

            case "rejected":

                // Lo dejamos para el siguiente paso,
                // porque primero necesitamos implementar
                // correctamente la devolución del stock.

                break;

            case "pending":

                // No hacemos nada.
                break;

            default:

                // El estado queda registrado en PaymentRecord.
                break;
        }
    }

    private void saveOrUpdatePaymentRecord(
            Payment payment,
            PurchaseOrderEntity order) {

        Long mpPaymentId = payment.getId();

        PaymentRecordEntity record = paymentRecordRepository
                .findByMpPaymentId(mpPaymentId)
                .orElseGet(PaymentRecordEntity::new);

        record.setPurchaseOrder(order);
        record.setMpPaymentId(mpPaymentId);
        record.setMpStatus(payment.getStatus());
        record.setAmount(payment.getTransactionAmount());

        if (record.getCreatedAt() == null) {
            record.setCreatedAt(LocalDateTime.now());
        }

        record.setUpdatedAt(LocalDateTime.now());

        paymentRecordRepository.save(record);
    }

    private JsonNode parseJson(String rawBody) {

        try {
            return objectMapper.readTree(rawBody);

        } catch (Exception e) {

            throw new RuntimeException(
                    "Webhook JSON inválido",
                    e);
        }
    }

    private String generateHmacSha256(
            String data,
            String secret) {

        try {

            Mac mac = Mac.getInstance("HmacSHA256");

            SecretKeySpec secretKey = new SecretKeySpec(
                    secret.getBytes(StandardCharsets.UTF_8),
                    "HmacSHA256");

            mac.init(secretKey);

            byte[] hash = mac.doFinal(
                    data.getBytes(StandardCharsets.UTF_8));

            return HexFormat
                    .of()
                    .formatHex(hash);

        } catch (Exception e) {

            throw new RuntimeException(
                    "Error generando HMAC-SHA256",
                    e);
        }
    }
}