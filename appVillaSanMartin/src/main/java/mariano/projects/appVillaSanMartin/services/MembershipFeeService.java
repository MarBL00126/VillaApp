package mariano.projects.appVillaSanMartin.services;

import java.time.LocalDateTime;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;

import lombok.RequiredArgsConstructor;
import mariano.projects.appVillaSanMartin.entities.MembershipEntity;
import mariano.projects.appVillaSanMartin.entities.MembershipFeeEntity;
import mariano.projects.appVillaSanMartin.models.dto.MembershipFeeDto;
import mariano.projects.appVillaSanMartin.repositories.MembershipFeeRepository;
import mariano.projects.appVillaSanMartin.repositories.MembershipRepository;

@Service
@RequiredArgsConstructor
public class MembershipFeeService {
    private final MembershipFeeRepository feeRepo;
    private final MembershipRepository membershipRepo;

    @Transactional(readOnly = true)
    public List<MembershipFeeDto> getMyFees(int userId) {
        MembershipEntity membership = getMembershipEntity(userId);
        return feeRepo.findByMembership_Id(membership.getId()).stream()
                .map(MembershipFeeDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MembershipFeeDto> getPendingFees(int userId) {
        MembershipEntity membership = getMembershipEntity(userId);
        return feeRepo.findByMembership_IdAndStatusIn(membership.getId(), List.of("PENDING", "OVERDUE")).stream()
                .map(MembershipFeeDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public MembershipFeeDto getFeeById(int feeId) {
        return MembershipFeeDto.from(getFeeEntityById(feeId));
    }

    public void confirmPayment(int feeId, String mpPaymentId) {
        MembershipFeeEntity fee = getFeeEntityById(feeId);
        fee.setStatus("PAID");
        fee.setPaidAt(LocalDateTime.now());
        fee.setMpPaymentId(mpPaymentId);
        feeRepo.save(fee);
    }

    public String createPaymentPreference(int feeId, int userId) {
        try {
            MembershipFeeEntity fee = getFeeEntityById(feeId);

            String monthName = Month.of(fee.getMonth()).getDisplayName(TextStyle.FULL, Locale.forLanguageTag("es-ES"));
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
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error creando preferencia MP", e);
        }
    }

    private MembershipEntity getMembershipEntity(int userId) {
        return membershipRepo.findByUser_Id(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    private MembershipFeeEntity getFeeEntityById(int feeId) {
        return feeRepo.findById(feeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }
}
