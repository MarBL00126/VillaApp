package mariano.projects.appVillaSanMartin.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import mariano.projects.appVillaSanMartin.entities.PaymentRecordEntity;
import mariano.projects.appVillaSanMartin.entities.PurchaseOrderEntity;
import mariano.projects.appVillaSanMartin.entities.PurchaseOrderStatus;
import mariano.projects.appVillaSanMartin.repositories.PaymentRecordRepository;
import mariano.projects.appVillaSanMartin.repositories.PurchaseOrderRepository;

@Service
@RequiredArgsConstructor
public class PaymentService {
        private final PurchaseOrderRepository purchaseOrderRepository;
        private final PaymentRecordRepository paymentRecordRepository;

        // CRÍTICO-4 FIX: URL base externalizada a variable de entorno (APP_BASE_URL).
        // En application.yaml: app.base-url: ${APP_BASE_URL:http://localhost:8080}
        // Esto evita URLs hardcodeadas a "tudominio.com" que rompen los pagos en producción.
        @Value("${app.base-url}")
        private String baseUrl;

        @Transactional
        public String createPreference(Long orderId) throws MPException, MPApiException {
                PurchaseOrderEntity order = purchaseOrderRepository.findById(orderId.intValue())
                                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));
                if (order.getStatus() != PurchaseOrderStatus.PENDING_PAYMENT) {
                        throw new RuntimeException("La orden no está pendiente de pago");
                }
                PreferenceItemRequest item = PreferenceItemRequest.builder()
                                .title("Entrada")
                                .quantity(order.getQuantity())
                                .unitPrice(order.getUnitPrice())
                                .currencyId("ARS")
                                .build();
                PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                                .success(baseUrl + "/payment/success?orderId=" + orderId)
                                .failure(baseUrl + "/payment/failure?orderId=" + orderId)
                                .pending(baseUrl + "/payment/pending?orderId=" + orderId)
                                .build();

                PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                                .items(List.of(item))
                                .externalReference(orderId.toString())
                                .backUrls(backUrls)
                                .notificationUrl(baseUrl + "/api/webhooks/mercadopago")
                                .build();
                PreferenceClient client = new PreferenceClient();
                Preference preference = client.create(preferenceRequest);
                PaymentRecordEntity paymentRecord = paymentRecordRepository.findByPurchaseOrderId(orderId)
                                .orElseGet(() -> {
                                        PaymentRecordEntity record = new PaymentRecordEntity();
                                        record.setPurchaseOrder(order);
                                        return record;
                                });
                paymentRecord.setMpPreferenceId(preference.getId());
                paymentRecord.setAmount(order.getTotalAmount());

                paymentRecordRepository.save(paymentRecord);
                return preference.getInitPoint();
        }
}
