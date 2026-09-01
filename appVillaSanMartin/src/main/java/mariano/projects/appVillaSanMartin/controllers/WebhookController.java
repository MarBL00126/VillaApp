package mariano.projects.appVillaSanMartin.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import mariano.projects.appVillaSanMartin.services.WebhookService;

@RestController
@RequestMapping("/webhooks")
@RequiredArgsConstructor
public class WebhookController {
    private final WebhookService webhookService;

    @PostMapping("/mercadopago")
    public ResponseEntity<Void> mercadopagoWebhook(
            @RequestBody String rawBody,
            @RequestHeader(value = "x-signature", required = false) String xSignature,
            @RequestHeader(value = "x-request-id", required = false) String xRequestId) {
        webhookService.processWebhook(
                rawBody,
                xSignature,
                xRequestId);

        return ResponseEntity.ok().build();
    }
}
