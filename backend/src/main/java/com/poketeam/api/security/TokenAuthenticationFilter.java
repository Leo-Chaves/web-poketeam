package com.poketeam.api.security;

import com.poketeam.api.entity.SessionToken;
import com.poketeam.api.repository.SessionTokenRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class TokenAuthenticationFilter extends OncePerRequestFilter {

    private static final String PREFIX = "Bearer ";

    private final SessionTokenRepository sessionTokenRepository;

    public TokenAuthenticationFilter(SessionTokenRepository sessionTokenRepository) {
        this.sessionTokenRepository = sessionTokenRepository;
    }

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {
        String authorization = request.getHeader("Authorization");

        if (authorization != null && authorization.startsWith(PREFIX)) {
            String tokenValue = authorization.substring(PREFIX.length()).trim();
            Optional<SessionToken> sessionToken = sessionTokenRepository.findByTokenAndRevokedFalse(tokenValue);

            if (sessionToken.isPresent() && sessionToken.get().getExpiresAt().isAfter(LocalDateTime.now())) {
                AuthenticatedUser principal = new AuthenticatedUser(sessionToken.get().getUser());
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    principal,
                    null,
                    principal.getAuthorities()
                );
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }
}
