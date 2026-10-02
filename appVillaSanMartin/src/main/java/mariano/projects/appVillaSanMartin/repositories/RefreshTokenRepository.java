package mariano.projects.appVillaSanMartin.repositories;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import mariano.projects.appVillaSanMartin.entities.RefreshTokenEntity;
@Repository 
public interface RefreshTokenRepository extends JpaRepository<RefreshTokenEntity, Integer>{
    Optional<RefreshTokenEntity> findByToken(String token);
    List<RefreshTokenEntity> findByUser_Id(Integer userId);
    List<RefreshTokenEntity> findByUser_IdAndRevokedFalse(Integer userId);
    boolean existsByTokenAndRevokedFalseAndExpiresAtAfter(String token, LocalDateTime now);
    void deleteByUser_Id(Integer userId);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE RefreshTokenEntity t SET t.revoked = true WHERE t.user.id = :userId AND t.revoked = false")
    int revokeAllByUserId(@Param("userId") Integer userId);
}
