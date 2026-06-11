package com.skillora.ai.dto;

import java.time.Instant;
import java.util.List;

public record SkillGapResponse(
        Long id,
        String targetRole,
        String company,
        String summary,
        List<SkillPriority> missingSkills,
        List<String> priorityRanking,
        List<String> learningRecommendations,
        Instant createdAt
) {
}
