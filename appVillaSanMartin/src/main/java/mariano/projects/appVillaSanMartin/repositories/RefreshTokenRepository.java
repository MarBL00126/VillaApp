package mariano.projects.appVillaSanMartin.repositories;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import mariano.projects.appVillaSanMartin.entities.RefreshTokenEntity;
@Repository 
public interface RefreshTokenRepository extends JpaRepository<RefreshTokenEntity, Integer>{
    Optional<RefreshTokenEntity> findByToken(String token);
    List<RefreshTokenEntity> findByUser_Id(Integer userId);
    List<RefreshTokenEntity> findByUser_IdAndRevokedFalse(Integer userId);
    boolean existsByTokenAndRevokedFalseAndExpiresAtAfter(String token, LocalDateTime now);
    void deleteByUser_Id(Integer userId);
}
