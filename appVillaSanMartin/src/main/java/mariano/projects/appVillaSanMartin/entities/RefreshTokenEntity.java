package mariano.projects.appVillaSanMartin.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity 
@Table (name = "refresh_tokens")
@Data 
public class RefreshTokenEntity {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne 
     @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;
    @Column(length = 255,unique = true,nullable = false)
    private String token;
    @Column(name="expires_at")
    private LocalDateTime expiresAt;
    @Column(nullable = false)
    private Boolean revoked;
    @Column(name="created_at")
    private LocalDateTime createdAt;
    public boolean isExpired() {
        return expiresAt != null && expiresAt.isBefore(LocalDateTime.now());
    }
    public boolean isActive() {
        return !Boolean.TRUE.equals(revoked) && !isExpired();
    }
}

