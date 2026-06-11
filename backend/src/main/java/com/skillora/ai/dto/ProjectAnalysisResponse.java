package com.skillora.ai.dto;

import java.time.Instant;
import java.util.List;

public record ProjectAnalysisResponse(
        Long id,
        String summary,
        List<String> resumeImprovements,
        List<String> scalabilitySuggestions,
        List<String> missingTechnologies,
        Instant createdAt
) {
}
