package mariano.projects.appVillaSanMartin.services;

import java.util.Collections;
import java.util.Map;

import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import mariano.projects.appVillaSanMartin.entities.AuditLogEntity;
import mariano.projects.appVillaSanMartin.entities.UserEntity;
import mariano.projects.appVillaSanMartin.repositories.AuditLogRepository;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;

@Service 
@RequiredArgsConstructor 
public class AuditService {
    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;
    public AuditLogEntity log(
            Integer userId,
            String action,
            String entityType,
            Integer entityId,
            Map<String, Object> details) {
        return log(userId, action, entityType, entityId, details, null);
    }
    public AuditLogEntity log(
            Integer userId,
            String action,
            String entityType,
            Integer entityId,
            Map<String, Object> details,
            HttpServletRequest request) {
                AuditLogEntity entity=new AuditLogEntity();
                entity.setUser(resolveUser(userId));
                entity.setAction(action);
                entity.setEntityType(entityType);
                entity.setEntityId(entityId);
                entity.setDetails(details!=null ?  details : Collections.emptyMap());
                if(request!=null){
                    entity.setIpAddress(resolveIpAddress(request));
                    entity.setUserAgent(request.getHeader("User-Agent"));
                }
                return auditLogRepository.save(entity);
            }
    public AuditLogEntity logSystem(String action, String entityType, Integer entityId, Map<String,
        Object> details) {
        return log(null, action, entityType, entityId, details, null);
    }
    private UserEntity resolveUser(Integer userId) {
        if (userId == null) {
            return null;
        }
        return userRepository.findById(userId).orElse(null);
    }
    private String resolveIpAddress(HttpServletRequest request){
        String forwardedFor=request.getHeader("X-Forwarded-For");
        if (forwardedFor !=null && !forwardedFor.isBlank()){
            return forwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
