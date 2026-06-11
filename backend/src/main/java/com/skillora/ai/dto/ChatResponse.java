package com.skillora.ai.dto;

import java.time.Instant;
import java.util.List;

public record ChatResponse(
        String answer,
        List<String> suggestedActions,
        Instant createdAt
) {
}
