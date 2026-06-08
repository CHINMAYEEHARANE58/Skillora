package com.skillora.profile;

import com.skillora.auth.dto.AuthResponse;
import com.skillora.auth.model.Role;
import com.skillora.auth.model.User;
import java.util.stream.Collectors;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserProfileController {

    @GetMapping("/me")
    public AuthResponse.UserResponse currentUser(@AuthenticationPrincipal User user) {
        return new AuthResponse.UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRoles().stream().map(Role::name).collect(Collectors.toSet())
        );
    }
}
