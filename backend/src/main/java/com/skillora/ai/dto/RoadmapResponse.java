package com.skillora.ai.dto;

import java.time.Instant;
import java.util.List;

public record RoadmapResponse(
        Long id,
        String targetRole,
        Integer availableWeeks,
        Integer hoursPerWeek,
        Integer progress,
        String summary,
        List<RoadmapStep> roadmap,
        List<String> milestones,
        Instant createdAt
) {
}
