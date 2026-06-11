package com.skillora.profile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateUserProfileRequest(
        @NotBlank(message = "Full name is required")
        @Size(max = 160, message = "Full name must be under 160 characters")
        String fullName,

        @NotBlank(message = "Skills are required")
        @Size(max = 1000, message = "Skills must be under 1000 characters")
        String skills,

        @NotBlank(message = "Education is required")
        @Size(max = 1000, message = "Education must be under 1000 characters")
        String education,

        @NotBlank(message = "Target role is required")
        @Size(max = 160, message = "Target role must be under 160 characters")
        String targetRole,

        @Size(max = 160, message = "Target company must be under 160 characters")
        String targetCompany
) {
}
