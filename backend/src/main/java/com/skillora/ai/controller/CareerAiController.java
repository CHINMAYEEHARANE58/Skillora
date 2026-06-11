package com.skillora.ai.controller;

import com.skillora.ai.dto.ChatRequest;
import com.skillora.ai.dto.ChatResponse;
import com.skillora.ai.dto.ProjectAnalysisRequest;
import com.skillora.ai.dto.ProjectAnalysisResponse;
import com.skillora.ai.dto.RoadmapRequest;
import com.skillora.ai.dto.RoadmapResponse;
import com.skillora.ai.dto.SkillGapRequest;
import com.skillora.ai.dto.SkillGapResponse;
import com.skillora.ai.service.CareerAiService;
import com.skillora.auth.model.User;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class CareerAiController {

    private final CareerAiService careerAiService;

    public CareerAiController(CareerAiService careerAiService) {
        this.careerAiService = careerAiService;
    }

    @PostMapping("/skill-gap")
    public SkillGapResponse analyzeSkillGap(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody SkillGapRequest request
    ) {
        return careerAiService.analyzeSkillGap(user, request);
    }

    @PostMapping("/roadmap")
    public RoadmapResponse generateRoadmap(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody RoadmapRequest request
    ) {
        return careerAiService.generateRoadmap(user, request);
    }

    @PostMapping("/chat")
    public ChatResponse chat(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ChatRequest request
    ) {
        return careerAiService.chat(user, request);
    }

    @PostMapping("/project-analysis")
    public ProjectAnalysisResponse analyzeProject(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ProjectAnalysisRequest request
    ) {
        return careerAiService.analyzeProject(user, request);
    }
}
