package mariano.projects.appVillaSanMartin.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity(name = "User")
@Table(name = "users")
@Data
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(nullable = false, length = 50)
    private String name;
    @Column(nullable = false, length = 50)
    private String surname;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private Role role;
    @Column(nullable = false, length = 50)
    private String email;
    @Column(nullable = false, length = 255)
    private String password;
    @Column
    private int points;
    @Column(name = "phone_number", nullable = false, length = 50)
    private String phoneNumber;
}
