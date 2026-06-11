package com.skillora.ai.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RoadmapRequest(
        @NotBlank(message = "Target role is required")
        @Size(max = 160, message = "Target role must be under 160 characters")
        String targetRole,

        @Size(max = 1000, message = "Current skills must be under 1000 characters")
        String currentSkills,

        @Min(value = 2, message = "Available weeks must be at least 2")
        @Max(value = 52, message = "Available weeks must be at most 52")
        Integer availableWeeks,

        @Min(value = 2, message = "Hours per week must be at least 2")
        @Max(value = 60, message = "Hours per week must be at most 60")
        Integer hoursPerWeek
) {
}
