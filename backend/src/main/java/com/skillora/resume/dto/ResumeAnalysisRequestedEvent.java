package com.skillora.resume.dto;

public record ResumeAnalysisRequestedEvent(
        Long analysisId,
        Long userId,
        String s3Key
) {
}
