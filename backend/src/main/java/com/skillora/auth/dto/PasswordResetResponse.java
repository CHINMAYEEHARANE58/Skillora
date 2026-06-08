package com.skillora.auth.dto;

public record PasswordResetResponse(String message, String resetToken) {
}
