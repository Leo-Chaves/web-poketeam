package com.poketeam.api.dto;

public record AuthResponse(
    String token,
    UserResponse user
) {
}
