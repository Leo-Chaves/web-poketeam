package com.poketeam.api.service;

import com.poketeam.api.dto.AuthResponse;
import com.poketeam.api.dto.LoginRequest;
import com.poketeam.api.dto.RegisterRequest;
import com.poketeam.api.dto.UserResponse;
import com.poketeam.api.entity.AppUser;
import com.poketeam.api.entity.SessionToken;
import com.poketeam.api.exception.BusinessException;
import com.poketeam.api.exception.UnauthorizedException;
import com.poketeam.api.repository.AppUserRepository;
import com.poketeam.api.repository.SessionTokenRepository;
import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AppUserRepository appUserRepository;
    private final SessionTokenRepository sessionTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final long tokenDaysValid;

    public AuthService(
        AppUserRepository appUserRepository,
        SessionTokenRepository sessionTokenRepository,
        PasswordEncoder passwordEncoder,
        @Value("${app.auth.token-days-valid:7}") long tokenDaysValid
    ) {
        this.appUserRepository = appUserRepository;
        this.sessionTokenRepository = sessionTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenDaysValid = tokenDaysValid;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();
        if (appUserRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new BusinessException("Já existe um usuário com esse e-mail.");
        }

        AppUser user = AppUser.builder()
            .name(request.name().trim())
            .email(normalizedEmail)
            .passwordHash(passwordEncoder.encode(request.password()))
            .build();

        AppUser savedUser = appUserRepository.save(user);
        SessionToken sessionToken = createSessionToken(savedUser);
        return new AuthResponse(sessionToken.getToken(), toUserResponse(savedUser));
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        AppUser user = appUserRepository.findByEmailIgnoreCase(request.email().trim().toLowerCase())
            .orElseThrow(() -> new UnauthorizedException("Credenciais inválidas."));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new UnauthorizedException("Credenciais inválidas.");
        }

        SessionToken sessionToken = createSessionToken(user);
        return new AuthResponse(sessionToken.getToken(), toUserResponse(user));
    }

    @Transactional(readOnly = true)
    public UserResponse me(AppUser user) {
        return toUserResponse(user);
    }

    @Transactional
    public void logout(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return;
        }

        String token = authorizationHeader.substring("Bearer ".length()).trim();
        sessionTokenRepository.findByTokenAndRevokedFalse(token).ifPresent(sessionToken -> {
            sessionToken.setRevoked(true);
            sessionTokenRepository.save(sessionToken);
        });
    }

    private SessionToken createSessionToken(AppUser user) {
        sessionTokenRepository.deleteByExpiresAtBefore(LocalDateTime.now());
        SessionToken sessionToken = SessionToken.builder()
            .token(UUID.randomUUID() + "-" + UUID.randomUUID())
            .expiresAt(LocalDateTime.now().plusDays(tokenDaysValid))
            .revoked(false)
            .user(user)
            .build();
        return sessionTokenRepository.save(sessionToken);
    }

    private UserResponse toUserResponse(AppUser user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail());
    }
}
