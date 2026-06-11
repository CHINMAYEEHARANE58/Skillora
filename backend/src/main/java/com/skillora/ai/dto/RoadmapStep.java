package com.skillora.ai.dto;

import java.util.List;

public record RoadmapStep(
        Integer week,
        String title,
        String focus,
        String deliverable,
        List<String> resources
) {
}
