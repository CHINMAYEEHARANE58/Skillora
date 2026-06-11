package com.skillora.profile;

import com.skillora.auth.model.Role;
import com.skillora.auth.model.User;
import java.util.Set;
import java.util.stream.Collectors;

public record UserProfileResponse(
        Long id,
        String fullName,
        String email,
        Set<String> roles,
        String skills,
        String education,
        String targetRole,
        String targetCompany
) {
    public static UserProfileResponse from(User user) {
        return new UserProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRoles().stream().map(Role::name).collect(Collectors.toSet()),
                user.getSkills(),
                user.getEducation(),
                user.getTargetRole(),
                user.getTargetCompany()
        );
    }
}
