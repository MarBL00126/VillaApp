package mariano.projects.appVillaSanMartin.services;
import mariano.projects.appVillaSanMartin.entities.MembershipEntity;
import mariano.projects.appVillaSanMartin.entities.MembershipFeeEntity;
import mariano.projects.appVillaSanMartin.repositories.MembershipRepository;
import mariano.projects.appVillaSanMartin.repositories.MembershipFeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;
@Service
@RequiredArgsConstructor
public class MembershipFeeService {
    private final MembershipFeeRepository feeRepo;
    private final MembershipRepository membershipRepo;
    public List<MembershipFeeEntity> getMyFees(int userId) {
        MembershipEntity m = membershipRepo.findByUser_Id(userId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return feeRepo.findByMembership_Id(m.getId());
    }
    public List<MembershipFeeEntity> getPendingFees(int userId) {
        MembershipEntity m = membershipRepo.findByUser_Id(userId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return feeRepo.findByMembership_IdAndStatusIn(m.getId(), List.of("PENDING", "OVERDUE"));
    }
    public MembershipFeeEntity getFeeById(int feeId) {
        return feeRepo.findById(feeId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }
    public void confirmPayment(int feeId, String mpPaymentId) {
        MembershipFeeEntity fee = getFeeById(feeId);
        fee.setStatus("PAID");
        fee.setPaidAt(LocalDateTime.now());
        fee.setMpPaymentId(mpPaymentId);
        feeRepo.save(fee);
    }
    public String createPaymentPreference(int feeId, int userId) {
        try {
            MembershipFeeEntity fee = getFeeById(feeId);
            String monthName = Month.of(fee.getMonth()).getDisplayName(TextStyle.FULL, new Locale("es", "ES"));
            PreferenceItemRequest item = PreferenceItemRequest.builder()
                .title("Cuota VSM " + monthName + "/" + fee.getYear())
                .quantity(1)
                .unitPrice(fee.getAmount())
                .currencyId("ARS")
                .build();
            PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                .success("https://tudominio.com/fees/success?feeId=" + feeId)
                .failure("https://tudominio.com/fees/failure?feeId=" + feeId)
                .pending("https://tudominio.com/fees/pending?feeId=" + feeId)
                .build();
            PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                .items(List.of(item))
                .externalReference(String.valueOf(feeId))
                .backUrls(backUrls)
                .build();
            PreferenceClient client = new PreferenceClient();
            com.mercadopago.resources.preference.Preference preference = client.create(preferenceRequest);
            return preference.getInitPoint();
        } catch (Exception e) {
            throw new RuntimeException("Error creando preferencia MP", e);
        }
    }
}
