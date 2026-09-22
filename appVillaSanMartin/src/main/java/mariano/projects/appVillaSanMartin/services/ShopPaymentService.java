package mariano.projects.appVillaSanMartin.services;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import lombok.RequiredArgsConstructor;
import mariano.projects.appVillaSanMartin.entities.ShopOrderEntity;
import mariano.projects.appVillaSanMartin.repositories.ShopOrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
@Service
@RequiredArgsConstructor
public class ShopPaymentService {
    private final ShopOrderRepository shopOrderRepository;
    @Transactional
    public String createPreference(Long shopOrderId) throws MPException, MPApiException {
        ShopOrderEntity order = shopOrderRepository.findById(shopOrderId.intValue())
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));
        if (!"PENDING_PAYMENT".equals(order.getStatus())) {
            throw new RuntimeException("La orden no está pendiente de pago");
        }
        PreferenceItemRequest item = PreferenceItemRequest.builder()
                .title("Compra Tienda VSM")
                .quantity(1)
                .unitPrice(order.getTotalAmount())
                .currencyId("ARS")
                .build();
        PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                .success("https://tudominio.com/payment/success?shopOrderId=" + shopOrderId)
                .failure("https://tudominio.com/payment/failure?shopOrderId=" + shopOrderId)
                .pending("https://tudominio.com/payment/pending?shopOrderId=" + shopOrderId)
                .build();
        PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                .items(List.of(item))
                .externalReference(shopOrderId.toString())
                .backUrls(backUrls)
                .notificationUrl("https://tudominio.com/webhooks/mercadopago")
                .build();
        PreferenceClient client = new PreferenceClient();
        Preference preference = client.create(preferenceRequest);
        order.setMpPreferenceId(preference.getId());
        shopOrderRepository.save(order);
        return preference.getInitPoint();
    }
}
