package com.skillora.dashboard.dto;

import java.util.List;

public record DashboardOverviewResponse(
        Integer resumeScore,
        Integer skillProgress,
        Integer roadmapProgress,
        Long aiUsageCount,
        List<String> recommendations,
        List<MetricPoint> readinessTrend,
        List<MetricPoint> skillTrends
) {
    public record MetricPoint(String name, Integer value) {
    }
}
