package mariano.projects.appVillaSanMartin.services;

import mariano.projects.appVillaSanMartin.entities.*;
import mariano.projects.appVillaSanMartin.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CommunityService {
    private final CommentRepository commentRepository;
    private final ReactionRepository reactionRepository;
    private final UserRepository userRepository;

    public List<CommentEntity> getComments(String targetType, int targetId) {
        return commentRepository.findByTargetTypeAndTargetIdOrderByCreatedAtAsc(targetType, targetId);
    }

    public List<CommentEntity> getFanWall() {
        return commentRepository.findTop50ByOrderByCreatedAtDesc();
    }

    public CommentEntity addComment(int userId, String targetType, int targetId, String content) {
        if (content == null || content.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El comentario no puede estar vacio");
        }
        CommentEntity comment = new CommentEntity();
        comment.setUser(userRepository.findById(userId).orElseThrow());
        comment.setTargetType(targetType);
        comment.setTargetId(targetId);
        comment.setContent(content.trim());
        comment.setCreatedAt(LocalDateTime.now());
        return commentRepository.save(comment);
    }

    public void deleteComment(int userId, int commentId) {
        CommentEntity comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (comment.getUser().getId() != userId) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        commentRepository.delete(comment);
    }

    public ReactionEntity react(int userId, String targetType, int targetId, String type) {
        return reactionRepository.findByUser_IdAndTargetTypeAndTargetIdAndType(userId, targetType, targetId, type)
            .orElseGet(() -> {
                ReactionEntity reaction = new ReactionEntity();
                reaction.setUser(userRepository.findById(userId).orElseThrow());
                reaction.setTargetType(targetType);
                reaction.setTargetId(targetId);
                reaction.setType(type);
                reaction.setCreatedAt(LocalDateTime.now());
                return reactionRepository.save(reaction);
            });
    }

    public Map<String, Long> getReactionCounts(String targetType, int targetId) {
        return Map.of(
            "LIKE", reactionRepository.countByTargetTypeAndTargetIdAndType(targetType, targetId, "LIKE"),
            "FIRE", reactionRepository.countByTargetTypeAndTargetIdAndType(targetType, targetId, "FIRE"),
            "CLAP", reactionRepository.countByTargetTypeAndTargetIdAndType(targetType, targetId, "CLAP")
        );
    }
}
