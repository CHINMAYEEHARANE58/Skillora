package com.skillora.dashboard;

import com.skillora.ai.model.CareerRoadmap;
import com.skillora.ai.model.SkillGapAnalysis;
import com.skillora.ai.repository.AiInteractionRepository;
import com.skillora.ai.repository.CareerRoadmapRepository;
import com.skillora.ai.repository.SkillGapAnalysisRepository;
import com.skillora.auth.model.User;
import com.skillora.dashboard.dto.DashboardOverviewResponse;
import com.skillora.resume.model.ResumeAnalysis;
import com.skillora.resume.repository.ResumeAnalysisRepository;
import java.util.ArrayList;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final ResumeAnalysisRepository resumeAnalysisRepository;
    private final SkillGapAnalysisRepository skillGapAnalysisRepository;
    private final CareerRoadmapRepository careerRoadmapRepository;
    private final AiInteractionRepository aiInteractionRepository;

    public DashboardController(
            ResumeAnalysisRepository resumeAnalysisRepository,
            SkillGapAnalysisRepository skillGapAnalysisRepository,
            CareerRoadmapRepository careerRoadmapRepository,
            AiInteractionRepository aiInteractionRepository
    ) {
        this.resumeAnalysisRepository = resumeAnalysisRepository;
        this.skillGapAnalysisRepository = skillGapAnalysisRepository;
        this.careerRoadmapRepository = careerRoadmapRepository;
        this.aiInteractionRepository = aiInteractionRepository;
    }

    @GetMapping("/overview")
    public DashboardOverviewResponse overview(@AuthenticationPrincipal User user) {
        ResumeAnalysis resume = resumeAnalysisRepository.findTopByUserOrderByCreatedAtDesc(user).orElse(null);
        SkillGapAnalysis skillGap = skillGapAnalysisRepository.findTopByUserOrderByCreatedAtDesc(user).orElse(null);
        CareerRoadmap roadmap = careerRoadmapRepository.findTopByUserOrderByCreatedAtDesc(user).orElse(null);

        int resumeScore = resume == null || resume.getAtsScore() == null ? 68 : resume.getAtsScore();
        int skillProgress = skillGap == null ? 62 : Math.max(35, 100 - (skillGap.getMissingSkills().size() * 12));
        int roadmapProgress = roadmap == null ? 20 : roadmap.getProgress();
        long aiUsageCount = aiInteractionRepository.countByUser(user);

        List<String> recommendations = new ArrayList<>();
        if (resume == null) {
            recommendations.add("Upload your latest resume to get an ATS baseline.");
        } else if (!resume.getSuggestedImprovements().isEmpty()) {
            recommendations.add(resume.getSuggestedImprovements().get(0));
        }
        if (skillGap == null) {
            recommendations.add("Run a skill gap analysis for your target role.");
        } else {
            recommendations.addAll(skillGap.getLearningRecommendations().stream().limit(2).toList());
        }
        if (roadmap == null) {
            recommendations.add("Generate a roadmap to convert gaps into weekly milestones.");
        } else if (!roadmap.getMilestones().isEmpty()) {
            recommendations.add("Next milestone: " + roadmap.getMilestones().get(0));
        }

        return new DashboardOverviewResponse(
                resumeScore,
                skillProgress,
                roadmapProgress,
                aiUsageCount,
                recommendations,
                List.of(
                        new DashboardOverviewResponse.MetricPoint("Resume", resumeScore),
                        new DashboardOverviewResponse.MetricPoint("Skills", skillProgress),
                        new DashboardOverviewResponse.MetricPoint("Roadmap", roadmapProgress),
                        new DashboardOverviewResponse.MetricPoint("AI usage", Math.min(100, (int) aiUsageCount * 10))
                ),
                List.of(
                        new DashboardOverviewResponse.MetricPoint("Current", skillProgress),
                        new DashboardOverviewResponse.MetricPoint("Target", 100),
                        new DashboardOverviewResponse.MetricPoint("Gap", Math.max(0, 100 - skillProgress))
                )
        );
    }
}
