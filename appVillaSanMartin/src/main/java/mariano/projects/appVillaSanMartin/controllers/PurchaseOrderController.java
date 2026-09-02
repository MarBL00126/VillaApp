package mariano.projects.appVillaSanMartin.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;

import mariano.projects.appVillaSanMartin.entities.PurchaseOrderEntity;
import mariano.projects.appVillaSanMartin.entities.UserEntity;
import mariano.projects.appVillaSanMartin.models.requests.ValidateQrRequest;
import mariano.projects.appVillaSanMartin.models.responses.QrValidationResponse;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;
import mariano.projects.appVillaSanMartin.services.PaymentService;
import mariano.projects.appVillaSanMartin.services.PurchaseOrderService;

@RestController
@RequestMapping("/api/orders")
public class PurchaseOrderController {

        private final PurchaseOrderService purchaseOrderService;
        private final PaymentService paymentService;
        private final UserRepository userRepository;

        public PurchaseOrderController(
                        PurchaseOrderService purchaseOrderService,
                        PaymentService paymentService,
                        UserRepository userRepository) {
                this.purchaseOrderService = purchaseOrderService;
                this.paymentService = paymentService;
                this.userRepository = userRepository;
        }

        private UserEntity getAuthenticatedUser(Authentication authentication) {
                UserDetails userDetails = (UserDetails) authentication.getPrincipal();
                return userRepository.findByEmail(userDetails.getUsername())
                                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        }

        @PostMapping
        public ResponseEntity<PurchaseOrderEntity> createOrder(
                        @RequestParam int reservationId,
                        Authentication authentication) {

                UserEntity user = getAuthenticatedUser(authentication);
                return ResponseEntity.ok(
                                purchaseOrderService.createOrder(user.getId(), reservationId));
        }

        @GetMapping("/my")
        public ResponseEntity<List<PurchaseOrderEntity>> getMyOrders(
                        Authentication authentication) {

                UserEntity user = getAuthenticatedUser(authentication);
                return ResponseEntity.ok(
                                purchaseOrderService.getMyOrders((long) user.getId()));
        }

        @PostMapping("/{id}/confirm-payment")
        public ResponseEntity<PurchaseOrderEntity> confirmPayment(
                        @PathVariable int id,
                        Authentication authentication) {

                UserEntity user = getAuthenticatedUser(authentication);
                return ResponseEntity.ok(
                                purchaseOrderService.confirmPayment(id, user.getId()));
        }

        @PostMapping("/validate-qr")
        public ResponseEntity<QrValidationResponse> validateQr(
                        @RequestBody ValidateQrRequest request) {
                return ResponseEntity.ok(
                                purchaseOrderService.validateQr(request.getEntryCode()));
        }

        @PostMapping("/{id}/pay")
        public ResponseEntity<Map<String, String>> pay(
                        @PathVariable Long id) throws MPException, MPApiException {

                String initPoint = paymentService.createPreference(id);
                return ResponseEntity.ok(Map.of("initPoint", initPoint));
        }

        @GetMapping("/{id}")
        public ResponseEntity<PurchaseOrderEntity> getOrderById(
                        @PathVariable int id,
                        Authentication authentication) {

                UserEntity user = getAuthenticatedUser(authentication);
                return ResponseEntity.ok(purchaseOrderService.getOrderById(id, user.getId()));
        }
}
