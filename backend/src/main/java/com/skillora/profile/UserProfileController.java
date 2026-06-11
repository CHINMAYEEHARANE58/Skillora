package com.skillora.profile;

import com.skillora.auth.dto.AuthResponse;
import com.skillora.auth.model.Role;
import com.skillora.auth.model.User;
import com.skillora.auth.repository.UserRepository;
import jakarta.validation.Valid;
import java.util.stream.Collectors;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserProfileController {

    private final UserRepository userRepository;

    public UserProfileController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public AuthResponse.UserResponse currentUser(@AuthenticationPrincipal User user) {
        return new AuthResponse.UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRoles().stream().map(Role::name).collect(Collectors.toSet())
        );
    }

    @GetMapping("/profile")
    public UserProfileResponse currentProfile(@AuthenticationPrincipal User user) {
        return UserProfileResponse.from(user);
    }

    @PutMapping("/profile")
    public UserProfileResponse updateProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateUserProfileRequest request
    ) {
        user.updateProfile(
                request.fullName(),
                request.skills(),
                request.education(),
                request.targetRole(),
                request.targetCompany()
        );
        return UserProfileResponse.from(userRepository.save(user));
    }
}
