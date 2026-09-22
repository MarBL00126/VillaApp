package mariano.projects.appVillaSanMartin.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
@Entity 
@Table (name = "memberships")
@Data 
public class MembershipEntity {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name = "membership_type_id", nullable = false)
    private MembershipTypeEntity membershipType;

    @Column(nullable = false, length = 30)
    private String status = "ACTIVE";

    @Column(name = "member_number", nullable = false, unique = true, length = 20)
    private String memberNumber;

    @Column(name = "joined_at")
    private LocalDateTime joinedAt;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    public String getFullName() {
        if (user == null) return null;
        return (user.getName() + " " + user.getSurname()).trim();
    }

    public MembershipTypeEntity getType() {
        return membershipType;
    }

    public LocalDateTime getCreatedAt() {
        return joinedAt;
    }
}
