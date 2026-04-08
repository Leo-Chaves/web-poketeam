package com.poketeam.api.dto;

public record UserResponse(
    Long id,
    String name,
    String email
) {
}
