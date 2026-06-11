package com.skillora.resume.dto;

import com.skillora.resume.model.ResumeAnalysis;
import com.skillora.resume.model.ResumeAnalysisStatus;
import java.time.Instant;
import java.util.List;

public record ResumeAnalysisResponse(
        Long id,
        String fileName,
        ResumeAnalysisStatus status,
        Integer atsScore,
        List<String> missingKeywords,
        List<String> missingTechnicalSkills,
        List<String> strengths,
        List<String> weaknesses,
        List<String> suggestedImprovements,
        String failureReason,
        Instant createdAt,
        Instant completedAt
) {
    public static ResumeAnalysisResponse from(ResumeAnalysis analysis) {
        return new ResumeAnalysisResponse(
                analysis.getId(),
                analysis.getFileName(),
                analysis.getStatus(),
                analysis.getAtsScore(),
                analysis.getMissingKeywords(),
                analysis.getMissingTechnicalSkills(),
                analysis.getStrengths(),
                analysis.getWeaknesses(),
                analysis.getSuggestedImprovements(),
                analysis.getFailureReason(),
                analysis.getCreatedAt(),
                analysis.getCompletedAt()
        );
    }
}
