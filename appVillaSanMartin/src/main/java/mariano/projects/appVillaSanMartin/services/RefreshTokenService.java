package mariano.projects.appVillaSanMartin.services;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;
import mariano.projects.appVillaSanMartin.config.JwtService;
import mariano.projects.appVillaSanMartin.entities.RefreshTokenEntity;
import mariano.projects.appVillaSanMartin.entities.UserEntity;
import mariano.projects.appVillaSanMartin.repositories.RefreshTokenRepository;
import mariano.projects.appVillaSanMartin.repositories.UserRepository;
@Service 
@RequiredArgsConstructor 
public class RefreshTokenService {
    private static final int TOKEN_BYTES = 64;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final SecureRandom secureRandom = new SecureRandom();
    @Value ("${jwt.refresh-expiration:604800000}")
    private long refreshExpirationMs;
    public RefreshTokenEntity createToken(UserEntity user){
        RefreshTokenEntity entity=new RefreshTokenEntity();
        entity.setUser(user);
        entity.setToken(generateOpaqueToken()); 
        entity.setExpiresAt(LocalDateTime.now().plusNanos(refreshExpirationMs * 1_000_000));
        entity.setRevoked(false);
        return refreshTokenRepository.save(entity);  
    }
    @Transactional 
    public Map<String,String> refresh(String refreshToken){
        RefreshTokenEntity current=refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token"));
        if (!current.isActive()){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token expired or revoked");
        }
        current.setRevoked(true);
        refreshTokenRepository.save(current);
        UserEntity user=current.getUser();
        RefreshTokenEntity nextRefreshToken=createToken(user);
        String jwt=jwtService.generateToken(user);
        return Map.of(
            "token",jwt,
            "refreshToken",nextRefreshToken.getToken()
        );
    }
    @Transactional 
    public void revoke(String refreshToken){
        RefreshTokenEntity token = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Refresh token not found"));
        token.setRevoked(true);
        refreshTokenRepository.save(token);
    }
    @Transactional 
    public void revokeAllForUser(Integer userId){
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        refreshTokenRepository.revokeAllByUserId(user.getId());
    }
    public boolean isValid(String refreshToken) {
        return refreshTokenRepository.existsByTokenAndRevokedFalseAndExpiresAtAfter(
                refreshToken,
                LocalDateTime.now());
    }
    private String generateOpaqueToken(){
        byte[] bytes=new byte[TOKEN_BYTES];
        secureRandom.nextBytes(bytes);
        return  Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
