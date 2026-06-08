package com.skillora.auth.controller;

import com.skillora.auth.dto.AuthResponse;
import com.skillora.auth.dto.ForgotPasswordRequest;
import com.skillora.auth.dto.LoginRequest;
import com.skillora.auth.dto.LogoutRequest;
import com.skillora.auth.dto.MessageResponse;
import com.skillora.auth.dto.PasswordResetResponse;
import com.skillora.auth.dto.RefreshTokenRequest;
import com.skillora.auth.dto.RegisterRequest;
import com.skillora.auth.dto.ResetPasswordRequest;
import com.skillora.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/refresh")
    public AuthResponse refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return authService.refresh(request);
    }

    @PostMapping("/logout")
    public MessageResponse logout(@Valid @RequestBody LogoutRequest request) {
        authService.logout(request);
        return new MessageResponse("Logged out successfully");
    }

    @PostMapping("/password/forgot")
    public PasswordResetResponse forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return authService.forgotPassword(request);
    }

    @PostMapping("/password/reset")
    public MessageResponse resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return new MessageResponse("Password reset successfully");
    }
}
