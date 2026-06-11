package com.skillora.ai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProjectAnalysisRequest(
        @NotBlank(message = "Project description is required")
        @Size(min = 40, max = 4000, message = "Project description must be 40 to 4000 characters")
        String projectDescription,

        @Size(max = 160, message = "Target role must be under 160 characters")
        String targetRole
) {
}
