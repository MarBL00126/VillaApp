package mariano.projects.appVillaSanMartin.services;

import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.payment.Payment;

import org.springframework.stereotype.Service;

// El access token se inicializa una sola vez en config.MercadoPagoConfig (@PostConstruct).
@Service
public class MercadoPagoService {

    public Payment getPayment(String paymentId) {

        try {

            PaymentClient paymentClient = new PaymentClient();

            return paymentClient.get(
                    Long.valueOf(paymentId));

        } catch (MPApiException e) {

            throw new RuntimeException(
                    "Error de API de Mercado Pago al consultar el pago "
                            + paymentId,
                    e);

        } catch (MPException e) {

            throw new RuntimeException(
                    "Error comunicándose con Mercado Pago",
                    e);
        }
    }
}