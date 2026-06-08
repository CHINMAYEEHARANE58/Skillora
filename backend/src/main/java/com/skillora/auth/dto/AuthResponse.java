package com.skillora.auth.dto;

import java.util.Set;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        UserResponse user
) {
    public record UserResponse(Long id, String fullName, String email, Set<String> roles) {
    }
}
