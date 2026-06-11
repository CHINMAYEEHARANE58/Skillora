package com.skillora.ai.service;

import com.skillora.ai.dto.ChatRequest;
import com.skillora.ai.dto.ChatResponse;
import com.skillora.ai.dto.ProjectAnalysisRequest;
import com.skillora.ai.dto.ProjectAnalysisResponse;
import com.skillora.ai.dto.RoadmapRequest;
import com.skillora.ai.dto.RoadmapResponse;
import com.skillora.ai.dto.RoadmapStep;
import com.skillora.ai.dto.SkillGapRequest;
import com.skillora.ai.dto.SkillGapResponse;
import com.skillora.ai.dto.SkillPriority;
import com.skillora.ai.model.AiInteraction;
import com.skillora.ai.model.CareerRoadmap;
import com.skillora.ai.model.ProjectAnalysis;
import com.skillora.ai.model.SkillGapAnalysis;
import com.skillora.ai.repository.AiInteractionRepository;
import com.skillora.ai.repository.CareerRoadmapRepository;
import com.skillora.ai.repository.ProjectAnalysisRepository;
import com.skillora.ai.repository.SkillGapAnalysisRepository;
import com.skillora.auth.model.User;
import com.skillora.resume.service.SnowflakeAnalyticsWriter;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CareerAiService {

    private static final Logger log = LoggerFactory.getLogger(CareerAiService.class);

    private final FastApiCareerClient fastApiCareerClient;
    private final SkillGapAnalysisRepository skillGapAnalysisRepository;
    private final CareerRoadmapRepository careerRoadmapRepository;
    private final ProjectAnalysisRepository projectAnalysisRepository;
    private final AiInteractionRepository aiInteractionRepository;
    private final SnowflakeAnalyticsWriter snowflakeAnalyticsWriter;

    public CareerAiService(
            FastApiCareerClient fastApiCareerClient,
            SkillGapAnalysisRepository skillGapAnalysisRepository,
            CareerRoadmapRepository careerRoadmapRepository,
            ProjectAnalysisRepository projectAnalysisRepository,
            AiInteractionRepository aiInteractionRepository,
            SnowflakeAnalyticsWriter snowflakeAnalyticsWriter
    ) {
        this.fastApiCareerClient = fastApiCareerClient;
        this.skillGapAnalysisRepository = skillGapAnalysisRepository;
        this.careerRoadmapRepository = careerRoadmapRepository;
        this.projectAnalysisRepository = projectAnalysisRepository;
        this.aiInteractionRepository = aiInteractionRepository;
        this.snowflakeAnalyticsWriter = snowflakeAnalyticsWriter;
    }

    @Transactional
    public SkillGapResponse analyzeSkillGap(User user, SkillGapRequest request) {
        String currentSkills = valueOrDefault(request.currentSkills(), user.getSkills());
        String company = valueOrDefault(request.company(), user.getTargetCompany());
        Map<String, Object> payload = Map.of(
                "targetRole", request.targetRole(),
                "company", company,
                "currentSkills", currentSkills,
                "education", user.getEducation()
        );

        SkillGapResponse aiResponse = callSkillGap(payload, request.targetRole(), company, currentSkills);
        SkillGapAnalysis saved = skillGapAnalysisRepository.save(new SkillGapAnalysis(
                user,
                request.targetRole(),
                company,
                aiResponse.summary(),
                aiResponse.missingSkills().stream().map(this::formatSkillPriority).toList(),
                safeList(aiResponse.priorityRanking()),
                safeList(aiResponse.learningRecommendations())
        ));

        SkillGapResponse response = new SkillGapResponse(
                saved.getId(),
                saved.getTargetRole(),
                saved.getCompany(),
                saved.getSummary(),
                safeList(aiResponse.missingSkills()),
                saved.getPriorityRanking(),
                saved.getLearningRecommendations(),
                saved.getCreatedAt()
        );
        recordInteraction(user, "SKILL_GAP", request.targetRole(), response.summary());
        return response;
    }

    @Transactional
    public RoadmapResponse generateRoadmap(User user, RoadmapRequest request) {
        String currentSkills = valueOrDefault(request.currentSkills(), user.getSkills());
        int availableWeeks = request.availableWeeks() == null ? 12 : request.availableWeeks();
        int hoursPerWeek = request.hoursPerWeek() == null ? 8 : request.hoursPerWeek();
        Map<String, Object> payload = Map.of(
                "targetRole", request.targetRole(),
                "currentSkills", currentSkills,
                "availableWeeks", availableWeeks,
                "hoursPerWeek", hoursPerWeek
        );

        RoadmapResponse aiResponse = callRoadmap(payload, request.targetRole(), availableWeeks, hoursPerWeek);
        CareerRoadmap saved = careerRoadmapRepository.save(new CareerRoadmap(
                user,
                request.targetRole(),
                availableWeeks,
                hoursPerWeek,
                aiResponse.summary(),
                safeList(aiResponse.roadmap()).stream().map(this::formatRoadmapStep).toList(),
                safeList(aiResponse.milestones())
        ));

        RoadmapResponse response = new RoadmapResponse(
                saved.getId(),
                saved.getTargetRole(),
                saved.getAvailableWeeks(),
                saved.getHoursPerWeek(),
                saved.getProgress(),
                saved.getSummary(),
                safeList(aiResponse.roadmap()),
                saved.getMilestones(),
                saved.getCreatedAt()
        );
        recordInteraction(user, "ROADMAP", request.targetRole(), response.summary());
        return response;
    }

    @Transactional
    public ChatResponse chat(User user, ChatRequest request) {
        Map<String, Object> payload = Map.of(
                "message", request.message(),
                "profile", Map.of(
                        "skills", user.getSkills(),
                        "education", user.getEducation(),
                        "targetRole", user.getTargetRole(),
                        "targetCompany", user.getTargetCompany()
                )
        );

        ChatResponse response = callChat(payload, request.message());
        recordInteraction(user, "CHAT", request.message(), response.answer());
        return response;
    }

    @Transactional
    public ProjectAnalysisResponse analyzeProject(User user, ProjectAnalysisRequest request) {
        String targetRole = valueOrDefault(request.targetRole(), user.getTargetRole());
        Map<String, Object> payload = Map.of(
                "projectDescription", request.projectDescription(),
                "targetRole", targetRole,
                "currentSkills", user.getSkills()
        );

        ProjectAnalysisResponse aiResponse = callProject(payload, targetRole);
        ProjectAnalysis saved = projectAnalysisRepository.save(new ProjectAnalysis(
                user,
                request.projectDescription(),
                aiResponse.summary(),
                safeList(aiResponse.resumeImprovements()),
                safeList(aiResponse.scalabilitySuggestions()),
                safeList(aiResponse.missingTechnologies())
        ));

        ProjectAnalysisResponse response = new ProjectAnalysisResponse(
                saved.getId(),
                saved.getSummary(),
                saved.getResumeImprovements(),
                saved.getScalabilitySuggestions(),
                saved.getMissingTechnologies(),
                saved.getCreatedAt()
        );
        recordInteraction(user, "PROJECT_ANALYSIS", targetRole, response.summary());
        return response;
    }

    private SkillGapResponse callSkillGap(
            Map<String, Object> payload,
            String targetRole,
            String company,
            String currentSkills
    ) {
        try {
            SkillGapResponse response = fastApiCareerClient.analyzeSkillGap(payload);
            if (response != null) {
                return response;
            }
        } catch (Exception exception) {
            log.warn("FastAPI skill gap analysis unavailable, using fallback: {}", exception.getMessage());
        }
        List<String> current = normalizedItems(currentSkills);
        List<SkillPriority> missing = fallbackMissingSkills(targetRole, current);
        return new SkillGapResponse(
                null,
                targetRole,
                company,
                "Focus on the highest signal skills for " + targetRole + " before expanding into adjacent tools.",
                missing,
                missing.stream().map(SkillPriority::skill).toList(),
                List.of(
                        "Build one portfolio project that proves the top missing skill.",
                        "Study job descriptions from " + company + " and add repeated keywords to your resume.",
                        "Schedule weekly revision blocks for fundamentals, implementation, and project polish."
                ),
                Instant.now()
        );
    }

    private RoadmapResponse callRoadmap(Map<String, Object> payload, String targetRole, int weeks, int hoursPerWeek) {
        try {
            RoadmapResponse response = fastApiCareerClient.generateRoadmap(payload);
            if (response != null) {
                return response;
            }
        } catch (Exception exception) {
            log.warn("FastAPI roadmap generation unavailable, using fallback: {}", exception.getMessage());
        }
        List<RoadmapStep> steps = new ArrayList<>();
        int block = Math.max(1, weeks / 4);
        steps.add(new RoadmapStep(1, "Role baseline", "Audit skills and collect target job descriptions", "Gap matrix and resume keyword list", List.of("Company career pages", "Recent job descriptions")));
        steps.add(new RoadmapStep(block + 1, "Core build", "Implement a role-aligned project with measurable scope", "Deployed project and updated resume bullets", List.of("Official framework docs", "System design primers")));
        steps.add(new RoadmapStep((block * 2) + 1, "Interview readiness", "Practice technical storytelling and project deep dives", "STAR stories and architecture notes", List.of("LeetCode patterns", "Behavioral question bank")));
        steps.add(new RoadmapStep((block * 3) + 1, "Application sprint", "Tailor resume and apply to target role clusters", "Tracked applications and outreach messages", List.of("LinkedIn", "Portfolio README")));
        return new RoadmapResponse(
                null,
                targetRole,
                weeks,
                hoursPerWeek,
                15,
                "A " + weeks + "-week plan paced at " + hoursPerWeek + " hours per week for " + targetRole + ".",
                steps,
                List.of("Resume reaches 80+ ATS score", "One flagship project shipped", "Weekly application rhythm started"),
                Instant.now()
        );
    }

    private ChatResponse callChat(Map<String, Object> payload, String message) {
        try {
            ChatResponse response = fastApiCareerClient.chat(payload);
            if (response != null) {
                return response;
            }
        } catch (Exception exception) {
            log.warn("FastAPI career chat unavailable, using fallback: {}", exception.getMessage());
        }
        return new ChatResponse(
                "Start with the role outcome, then work backwards into skills, proof projects, and interview stories. For your question: " + message,
                List.of(
                        "Turn the question into a one-week action item.",
                        "Add one measurable resume bullet after finishing the work.",
                        "Ask Skillora to analyze the project once the first version is ready."
                ),
                Instant.now()
        );
    }

    private ProjectAnalysisResponse callProject(Map<String, Object> payload, String targetRole) {
        try {
            ProjectAnalysisResponse response = fastApiCareerClient.analyzeProject(payload);
            if (response != null) {
                return response;
            }
        } catch (Exception exception) {
            log.warn("FastAPI project analysis unavailable, using fallback: {}", exception.getMessage());
        }
        return new ProjectAnalysisResponse(
                null,
                "The project can become stronger for " + targetRole + " by showing scale, ownership, and measurable product impact.",
                List.of(
                        "Rewrite the project as problem, users, architecture, tradeoffs, and result.",
                        "Add metrics such as latency, adoption, reliability, or automation time saved.",
                        "Mention testing, deployment, observability, and data model choices."
                ),
                List.of(
                        "Add caching and background jobs for expensive workflows.",
                        "Document database indexes, API pagination, and failure handling.",
                        "Introduce CI checks and environment-based configuration."
                ),
                List.of("Docker", "CI/CD", "Observability", "Cloud deployment"),
                Instant.now()
        );
    }

    private void recordInteraction(User user, String feature, String requestSummary, String responseSummary) {
        AiInteraction saved = aiInteractionRepository.save(new AiInteraction(
                user,
                feature,
                limit(requestSummary),
                limit(responseSummary)
        ));
        snowflakeAnalyticsWriter.writeAiUsage(saved);
    }

    private String formatSkillPriority(SkillPriority priority) {
        return "%s | %s | %s".formatted(priority.skill(), priority.priority(), priority.reason());
    }

    private String formatRoadmapStep(RoadmapStep step) {
        return "Week %d: %s - %s".formatted(step.week(), step.title(), step.deliverable());
    }

    private List<SkillPriority> fallbackMissingSkills(String targetRole, List<String> currentSkills) {
        List<String> baseline = targetRole.toLowerCase().contains("data")
                ? List.of("Python", "SQL optimization", "Machine learning", "Data storytelling", "Cloud data pipelines")
                : List.of("System design", "API security", "Cloud deployment", "Testing strategy", "Observability");
        return baseline.stream()
                .filter(skill -> currentSkills.stream().noneMatch(current -> current.equalsIgnoreCase(skill)))
                .limit(5)
                .map(skill -> new SkillPriority(skill, skill.equals("System design") ? "High" : "Medium", "Frequently requested for " + targetRole + " roles."))
                .toList();
    }

    private List<String> normalizedItems(String text) {
        if (text == null || text.isBlank()) {
            return List.of();
        }
        return List.of(text.split(",")).stream()
                .map(String::trim)
                .filter(item -> !item.isBlank())
                .toList();
    }

    private String valueOrDefault(String value, String fallback) {
        if (value != null && !value.isBlank()) {
            return value;
        }
        return fallback == null || fallback.isBlank() ? "General target" : fallback;
    }

    private String limit(String value) {
        if (value == null) {
            return "";
        }
        return value.length() <= 2000 ? value : value.substring(0, 2000);
    }

    private <T> List<T> safeList(List<T> values) {
        return values == null ? List.of() : values;
    }
}
