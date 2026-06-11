package com.skillora.ai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SkillGapRequest(
        @NotBlank(message = "Target role is required")
        @Size(max = 160, message = "Target role must be under 160 characters")
        String targetRole,

        @Size(max = 160, message = "Company must be under 160 characters")
        String company,

        @Size(max = 1000, message = "Current skills must be under 1000 characters")
        String currentSkills
) {
}
