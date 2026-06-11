package com.skillora.resume.service;

import com.skillora.resume.dto.FastApiResumeAnalysisResponse;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class FastApiResumeAnalyzerClient {

    private final RestClient restClient;
    private final String analyzerUrl;

    public FastApiResumeAnalyzerClient(@Value("${skillora.ai.resume-analyzer-url}") String analyzerUrl) {
        this.restClient = RestClient.create();
        this.analyzerUrl = analyzerUrl;
    }

    public FastApiResumeAnalysisResponse analyze(String resumeText) {
        return restClient.post()
                .uri(analyzerUrl)
                .body(Map.of("resumeText", resumeText))
                .retrieve()
                .body(FastApiResumeAnalysisResponse.class);
    }
}
