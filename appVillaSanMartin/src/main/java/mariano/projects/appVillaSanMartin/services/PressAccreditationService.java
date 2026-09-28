package mariano.projects.appVillaSanMartin.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import mariano.projects.appVillaSanMartin.entities.PressAccreditationEntity;
import mariano.projects.appVillaSanMartin.models.requests.PressAccreditationRequest;
import mariano.projects.appVillaSanMartin.models.requests.PressApprovalRequest;
import mariano.projects.appVillaSanMartin.models.requests.PressRejectionRequest;
import mariano.projects.appVillaSanMartin.models.responses.PressAccreditationResponse;
import mariano.projects.appVillaSanMartin.repositories.PressAccreditationRepository;

@Service 
@RequiredArgsConstructor 
public class PressAccreditationService {
    private final PressAccreditationRepository repository;

    public PressAccreditationResponse request(
            PressAccreditationRequest request,
            Integer userId) {

        PressAccreditationEntity entity =
                new PressAccreditationEntity();

        entity.setUserId(userId);
        entity.setMatchId(request.getMatchId());
        entity.setJournalistName(request.getJournalistName());
        entity.setMediaName(request.getMediaName());
        entity.setRole(request.getRole());
        entity.setEmail(request.getEmail());
        entity.setPhone(request.getPhone());
        entity.setCoverageType(request.getCoverageType());
        entity.setStatus("PENDING");
        entity.setSubmittedAt(LocalDateTime.now());

        return toResponse(repository.save(entity));
    }

    public List<PressAccreditationResponse> getMyAccreditations(
            Integer userId) {

        return repository.findByUserId(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<PressAccreditationResponse> getAdminList(
            Integer matchId,
            String status) {

        List<PressAccreditationEntity> result;

        if (matchId != null && status != null) {
            result = repository.findByMatchIdAndStatus(
                    matchId,
                    status
            );
        } else if (matchId != null) {
            result = repository.findByMatchId(matchId);
        } else if (status != null) {
            result = repository.findByStatus(status);
        } else {
            result = repository.findAll();
        }

        return result.stream()
                .map(this::toResponse)
                .toList();
    }

    public PressAccreditationResponse approve(
            Integer id,
            PressApprovalRequest request,
            Integer reviewerId) {

        PressAccreditationEntity entity =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Acreditación no encontrada"
                                ));

        entity.setStatus("APPROVED");

        entity.setQrCode(
                UUID.randomUUID().toString()
        );

        entity.setSectorId(request.getSectorId());
        entity.setGate(request.getGate());
        entity.setValidFrom(request.getValidFrom());
        entity.setValidUntil(request.getValidUntil());

        entity.setReviewedAt(LocalDateTime.now());
        entity.setReviewedBy(reviewerId);

        return toResponse(repository.save(entity));
    }

    public PressAccreditationResponse reject(
            Integer id,
            PressRejectionRequest request,
            Integer reviewerId) {

        PressAccreditationEntity entity =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Acreditación no encontrada"
                                ));

        entity.setStatus("REJECTED");
        entity.setNotes(request.getNotes());
        entity.setReviewedAt(LocalDateTime.now());
        entity.setReviewedBy(reviewerId);

        return toResponse(repository.save(entity));
    }

    public PressAccreditationResponse revoke(
            Integer id,
            Integer reviewerId) {

        PressAccreditationEntity entity =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Acreditación no encontrada"
                                ));

        entity.setStatus("REVOKED");
        entity.setReviewedAt(LocalDateTime.now());
        entity.setReviewedBy(reviewerId);

        return toResponse(repository.save(entity));
    }

    private PressAccreditationResponse toResponse(
            PressAccreditationEntity entity) {

        return new PressAccreditationResponse(
                entity.getId(),
                entity.getMatchId(),
                entity.getJournalistName(),
                entity.getMediaName(),
                entity.getRole(),
                entity.getEmail(),
                entity.getPhone(),
                entity.getCoverageType(),
                entity.getStatus(),
                entity.getNotes(),
                entity.getQrCode(),
                entity.getSectorId(),
                entity.getGate(),
                entity.getValidFrom(),
                entity.getValidUntil(),
                entity.getSubmittedAt()
        );
    }
}
