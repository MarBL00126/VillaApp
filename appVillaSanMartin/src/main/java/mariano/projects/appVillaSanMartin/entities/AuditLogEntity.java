package mariano.projects.appVillaSanMartin.entities;

import java.time.LocalDateTime;
import java.util.Map;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity (name="AuditLog")
@Table (name="audit_log")
@Data 
public class AuditLogEntity {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @Column(length = 50)
    private String action;

    @Column(name = "entity_type",length = 50)
    private String entityType;
    @Column(name = "entity_id")
    private Integer entityId;

    @Column(name = "ip_address",length = 45)
    private String ipAddress;
    @Column(name = "user_agent",length = 300)
    private String userAgent;
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> details;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}

