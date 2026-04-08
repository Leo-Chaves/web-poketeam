package com.poketeam.api.repository;

import com.poketeam.api.entity.SessionToken;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionTokenRepository extends JpaRepository<SessionToken, Long> {

    Optional<SessionToken> findByTokenAndRevokedFalse(String token);

    void deleteByExpiresAtBefore(LocalDateTime dateTime);
}
