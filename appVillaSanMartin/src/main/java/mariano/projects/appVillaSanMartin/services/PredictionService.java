package mariano.projects.appVillaSanMartin.services;

import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PredictionService {
    private final MatchPredictionRepository predictionRepository;
    private final MatchRepository matchRepository;
    private final UserRepository userRepository;
    private final PointsService pointsService;

    public List<MatchPredictionEntity> getForMatch(int matchId) {
        return predictionRepository.findByMatch_IdOrderByCreatedAtDesc(matchId);
    }

    @Transactional
    public MatchPredictionEntity predict(int userId, int matchId, int homeScore, int awayScore) {
        UserEntity user = userRepository.findById(userId).orElseThrow();
        MatchEntity match = matchRepository.findById(matchId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Partido no encontrado"));

        MatchPredictionEntity prediction = predictionRepository.findByUser_IdAndMatch_Id(userId, matchId)
            .orElseGet(MatchPredictionEntity::new);
        boolean isNew = prediction.getId() == null;
        prediction.setUser(user);
        prediction.setMatch(match);
        prediction.setPredictedHomeScore(homeScore);
        prediction.setPredictedAwayScore(awayScore);
        if (prediction.getCreatedAt() == null) prediction.setCreatedAt(LocalDateTime.now());
        if (isNew) {
            prediction.setPointsAwarded(10);
        }
        MatchPredictionEntity saved = predictionRepository.save(prediction);
        if (isNew) {
            pointsService.award(userId, 10, "PREDICTION", saved.getId());
        }
        return saved;
    }
}
