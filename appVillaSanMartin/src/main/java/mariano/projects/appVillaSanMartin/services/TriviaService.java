package mariano.projects.appVillaSanMartin.services;

import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TriviaService {
    private final TriviaRepository triviaRepository;
    private final TriviaQuestionRepository questionRepository;
    private final TriviaOptionRepository optionRepository;
    private final TriviaAttemptRepository attemptRepository;
    private final UserRepository userRepository;
    private final PointsService pointsService;

    public List<TriviaEntity> getActive() {
        return triviaRepository.findByActiveTrueOrderByCreatedAtDesc();
    }

    public Map<String, Object> getDetail(int triviaId) {
        TriviaEntity trivia = triviaRepository.findById(triviaId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trivia no encontrada"));
        List<TriviaQuestionEntity> questions = questionRepository.findByTriviaIdOrderBySortOrderAsc(triviaId);
        List<Map<String, Object>> questionDtos = questions.stream().map(q -> Map.of(
            "id", q.getId(),
            "question", q.getQuestion(),
            "sortOrder", q.getSortOrder(),
            "options", optionRepository.findByQuestionIdOrderByIdAsc(q.getId()).stream()
                .map(o -> Map.of("id", o.getId(), "text", o.getText()))
                .toList()
        )).toList();
        return Map.of("trivia", trivia, "questions", questionDtos);
    }

    @Transactional
    public TriviaAttemptEntity submit(int userId, int triviaId, Collection<Integer> selectedOptionIds) {
        TriviaEntity trivia = triviaRepository.findById(triviaId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trivia no encontrada"));
        Optional<TriviaAttemptEntity> existing = attemptRepository.findByUser_IdAndTrivia_Id(userId, triviaId);
        if (existing.isPresent()) return existing.get();

        List<TriviaQuestionEntity> questions = questionRepository.findByTriviaIdOrderBySortOrderAsc(triviaId);
        Set<Integer> selected = selectedOptionIds == null ? Set.of() : new HashSet<>(selectedOptionIds);
        Map<Integer, List<TriviaOptionEntity>> optionsByQuestion = optionRepository.findByQuestionIdIn(
            questions.stream().map(TriviaQuestionEntity::getId).toList()
        ).stream().collect(Collectors.groupingBy(TriviaOptionEntity::getQuestionId));

        int correct = 0;
        for (TriviaQuestionEntity question : questions) {
            boolean questionCorrect = optionsByQuestion.getOrDefault(question.getId(), List.of()).stream()
                .filter(TriviaOptionEntity::getIsCorrect)
                .anyMatch(option -> selected.contains(option.getId()));
            if (questionCorrect) correct++;
        }
        int points = questions.isEmpty() ? 0 : Math.max(5, (trivia.getPoints() * correct) / questions.size());

        TriviaAttemptEntity attempt = new TriviaAttemptEntity();
        attempt.setUser(userRepository.findById(userId).orElseThrow());
        attempt.setTrivia(trivia);
        attempt.setScore(correct);
        attempt.setPointsAwarded(points);
        attempt.setCompletedAt(LocalDateTime.now());
        TriviaAttemptEntity saved = attemptRepository.save(attempt);
        if (points > 0) pointsService.award(userId, points, "TRIVIA", saved.getId());
        return saved;
    }
}
