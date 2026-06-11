package com.skillora.ai.service;

import com.skillora.ai.dto.ChatResponse;
import com.skillora.ai.dto.ProjectAnalysisResponse;
import com.skillora.ai.dto.RoadmapResponse;
import com.skillora.ai.dto.SkillGapResponse;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class FastApiCareerClient {

    private final RestClient restClient;

    public FastApiCareerClient(@Value("${skillora.ai.service-base-url:http://localhost:8000}") String serviceBaseUrl) {
        this.restClient = RestClient.builder()
                .baseUrl(serviceBaseUrl)
                .build();
    }

    public SkillGapResponse analyzeSkillGap(Map<String, Object> payload) {
        return restClient.post()
                .uri("/skill-gap")
                .body(payload)
                .retrieve()
                .body(SkillGapResponse.class);
    }

    public RoadmapResponse generateRoadmap(Map<String, Object> payload) {
        return restClient.post()
                .uri("/career-roadmap")
                .body(payload)
                .retrieve()
                .body(RoadmapResponse.class);
    }

    public ChatResponse chat(Map<String, Object> payload) {
        return restClient.post()
                .uri("/career-chat")
                .body(payload)
                .retrieve()
                .body(ChatResponse.class);
    }

    public ProjectAnalysisResponse analyzeProject(Map<String, Object> payload) {
        return restClient.post()
                .uri("/project-analysis")
                .body(payload)
                .retrieve()
                .body(ProjectAnalysisResponse.class);
    }
}
