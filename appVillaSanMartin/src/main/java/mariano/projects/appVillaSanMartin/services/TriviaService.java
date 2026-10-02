package mariano.projects.appVillaSanMartin.services;

import mariano.projects.appVillaSanMartin.entities.TriviaAttemptEntity;
import mariano.projects.appVillaSanMartin.entities.TriviaEntity;
import mariano.projects.appVillaSanMartin.entities.TriviaOptionEntity;
import mariano.projects.appVillaSanMartin.entities.TriviaQuestionEntity;
import mariano.projects.appVillaSanMartin.models.dto.TriviaAttemptDto;
import mariano.projects.appVillaSanMartin.models.dto.TriviaDetailDto;
import mariano.projects.appVillaSanMartin.models.dto.TriviaDto;
import mariano.projects.appVillaSanMartin.models.dto.TriviaOptionDto;
import mariano.projects.appVillaSanMartin.models.dto.TriviaQuestionDto;
import mariano.projects.appVillaSanMartin.repositories.TriviaAttemptRepository;
import mariano.projects.appVillaSanMartin.repositories.TriviaOptionRepository;
import mariano.projects.appVillaSanMartin.repositories.TriviaQuestionRepository;
import mariano.projects.appVillaSanMartin.repositories.TriviaRepository;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
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

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "trivia-active")
    public List<TriviaDto> getActive() {
        return triviaRepository.findByActiveTrueOrderByCreatedAtDesc().stream().map(TriviaDto::from).toList();
    }

    @Transactional(readOnly = true)
    public TriviaDetailDto getDetail(int triviaId) {
        TriviaEntity trivia = triviaRepository.findById(triviaId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trivia no encontrada"));
        List<TriviaQuestionEntity> questions = questionRepository.findByTriviaIdOrderBySortOrderAsc(triviaId);
        Map<Integer, List<TriviaOptionDto>> optionsByQuestion = optionRepository
            .findByQuestionIdInOrderByQuestionIdAscIdAsc(questions.stream().map(TriviaQuestionEntity::getId).toList())
            .stream()
            .collect(Collectors.groupingBy(
                TriviaOptionEntity::getQuestionId,
                LinkedHashMap::new,
                Collectors.mapping(TriviaOptionDto::from, Collectors.toList())));
        List<TriviaQuestionDto> questionDtos = questions.stream()
            .map(question -> TriviaQuestionDto.from(question, optionsByQuestion.getOrDefault(question.getId(), List.of())))
            .toList();
        return TriviaDetailDto.from(trivia, questionDtos);
    }

    @Transactional
    @CacheEvict(cacheNames = "trivia-active", allEntries = true)
    public TriviaAttemptDto submit(int userId, int triviaId, Collection<Integer> selectedOptionIds) {
        TriviaEntity trivia = triviaRepository.findById(triviaId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trivia no encontrada"));
        Optional<TriviaAttemptEntity> existing = attemptRepository.findByUser_IdAndTrivia_Id(userId, triviaId);
        if (existing.isPresent()) return TriviaAttemptDto.from(existing.get());

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
        return TriviaAttemptDto.from(saved);
    }
}
