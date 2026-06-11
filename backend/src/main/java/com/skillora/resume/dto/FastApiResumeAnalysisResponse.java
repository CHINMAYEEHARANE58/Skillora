package com.skillora.resume.dto;

import java.util.List;

public record FastApiResumeAnalysisResponse(
        Integer atsScore,
        List<String> missingKeywords,
        List<String> missingTechnicalSkills,
        List<String> strengths,
        List<String> weaknesses,
        List<String> suggestedImprovements
) {
}
