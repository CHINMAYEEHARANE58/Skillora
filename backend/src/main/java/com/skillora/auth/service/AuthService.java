package com.skillora.auth.service;

import com.skillora.auth.dto.AuthResponse;
import com.skillora.auth.dto.ForgotPasswordRequest;
import com.skillora.auth.dto.LoginRequest;
import com.skillora.auth.dto.LogoutRequest;
import com.skillora.auth.dto.PasswordResetResponse;
import com.skillora.auth.dto.RefreshTokenRequest;
import com.skillora.auth.dto.RegisterRequest;
import com.skillora.auth.dto.ResetPasswordRequest;
import com.skillora.auth.model.PasswordResetToken;
import com.skillora.auth.model.RefreshToken;
import com.skillora.auth.model.Role;
import com.skillora.auth.model.User;
import com.skillora.auth.repository.PasswordResetTokenRepository;
import com.skillora.auth.repository.RefreshTokenRepository;
import com.skillora.auth.repository.UserRepository;
import com.skillora.security.JwtService;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final long refreshExpirationDays;

    public AuthService(
            UserRepository userRepository,
            RefreshTokenRepository refreshTokenRepository,
            PasswordResetTokenRepository passwordResetTokenRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            @Value("${skillora.jwt.refresh-expiration-days}") long refreshExpirationDays
    ) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.refreshExpirationDays = refreshExpirationDays;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.email())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User user = new User(
                request.fullName(),
                request.email().toLowerCase(),
                passwordEncoder.encode(request.password()),
                Set.of(Role.USER)
        );

        User savedUser = userRepository.save(user);
        return authResponse(savedUser);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        User user = userRepository.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return authResponse(user);
    }

    @Transactional
    public AuthResponse refresh(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.refreshToken())
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));

        if (refreshToken.isRevoked() || refreshToken.getExpiresAt().isBefore(Instant.now())) {
            throw new IllegalArgumentException("Refresh token expired or revoked");
        }

        refreshToken.revoke();
        return authResponse(refreshToken.getUser());
    }

    @Transactional
    public void logout(LogoutRequest request) {
        refreshTokenRepository.findByToken(request.refreshToken()).ifPresent(token -> {
            token.revoke();
            refreshTokenRepository.save(token);
        });
    }

    @Transactional
    public PasswordResetResponse forgotPassword(ForgotPasswordRequest request) {
        return userRepository.findByEmailIgnoreCase(request.email())
                .map(user -> {
                    PasswordResetToken resetToken = new PasswordResetToken(
                            UUID.randomUUID().toString(),
                            user,
                            Instant.now().plusSeconds(30 * 60)
                    );
                    passwordResetTokenRepository.save(resetToken);
                    return new PasswordResetResponse(
                            "Password reset token generated. Send this token by email in production.",
                            resetToken.getToken()
                    );
                })
                .orElse(new PasswordResetResponse("If the email exists, a reset link will be sent.", null));
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.token())
                .orElseThrow(() -> new IllegalArgumentException("Invalid password reset token"));

        if (resetToken.isUsed() || resetToken.getExpiresAt().isBefore(Instant.now())) {
            throw new IllegalArgumentException("Password reset token expired or already used");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        resetToken.markUsed();
        userRepository.save(user);
        passwordResetTokenRepository.save(resetToken);
        refreshTokenRepository.deleteByUser(user);
    }

    private AuthResponse authResponse(User user) {
        String refreshToken = UUID.randomUUID().toString();
        refreshTokenRepository.save(new RefreshToken(
                refreshToken,
                user,
                Instant.now().plusSeconds(refreshExpirationDays * 24 * 60 * 60)
        ));

        return new AuthResponse(jwtService.generateAccessToken(user), refreshToken, userResponse(user));
    }

    private AuthResponse.UserResponse userResponse(User user) {
        Set<String> roles = user.getRoles().stream().map(Role::name).collect(Collectors.toSet());
        return new AuthResponse.UserResponse(user.getId(), user.getFullName(), user.getEmail(), roles);
    }

}
