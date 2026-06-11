package com.skillora.resume.service;

import com.skillora.auth.model.User;
import com.skillora.resume.dto.FastApiResumeAnalysisResponse;
import com.skillora.resume.dto.ResumeAnalysisRequestedEvent;
import com.skillora.resume.dto.ResumeAnalysisResponse;
import com.skillora.resume.model.ResumeAnalysis;
import com.skillora.resume.repository.ResumeAnalysisRepository;
import java.io.IOException;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ResumeAnalysisService {

    private final ResumeAnalysisRepository resumeAnalysisRepository;
    private final ResumeStorageService resumeStorageService;
    private final PdfTextExtractor pdfTextExtractor;
    private final FastApiResumeAnalyzerClient analyzerClient;
    private final SnowflakeAnalyticsWriter snowflakeAnalyticsWriter;
    private final KafkaTemplate<String, ResumeAnalysisRequestedEvent> kafkaTemplate;
    private final String resumeTopic;
    private final boolean kafkaEnabled;

    public ResumeAnalysisService(
            ResumeAnalysisRepository resumeAnalysisRepository,
            ResumeStorageService resumeStorageService,
            PdfTextExtractor pdfTextExtractor,
            FastApiResumeAnalyzerClient analyzerClient,
            SnowflakeAnalyticsWriter snowflakeAnalyticsWriter,
            KafkaTemplate<String, ResumeAnalysisRequestedEvent> kafkaTemplate,
            @Value("${skillora.kafka.resume-topic}") String resumeTopic,
            @Value("${skillora.kafka.enabled:true}") boolean kafkaEnabled
    ) {
        this.resumeAnalysisRepository = resumeAnalysisRepository;
        this.resumeStorageService = resumeStorageService;
        this.pdfTextExtractor = pdfTextExtractor;
        this.analyzerClient = analyzerClient;
        this.snowflakeAnalyticsWriter = snowflakeAnalyticsWriter;
        this.kafkaTemplate = kafkaTemplate;
        this.resumeTopic = resumeTopic;
        this.kafkaEnabled = kafkaEnabled;
    }

    @Transactional
    public ResumeAnalysisResponse upload(User user, MultipartFile file) throws IOException {
        validatePdf(file);

        String s3Key = resumeStorageService.upload(user.getId(), file);
        ResumeAnalysis analysis = resumeAnalysisRepository.save(new ResumeAnalysis(
                user,
                file.getOriginalFilename() == null ? "resume.pdf" : file.getOriginalFilename(),
                s3Key
        ));

        ResumeAnalysisRequestedEvent event = new ResumeAnalysisRequestedEvent(
                analysis.getId(),
                user.getId(),
                s3Key
        );
        if (kafkaEnabled) {
            kafkaTemplate.send(resumeTopic, analysis.getId().toString(), event);
        } else {
            process(analysis.getId());
        }

        return findByIdForUser(user, analysis.getId());
    }

    @Transactional(readOnly = true)
    public List<ResumeAnalysisResponse> findForUser(User user) {
        return resumeAnalysisRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(ResumeAnalysisResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public ResumeAnalysisResponse findByIdForUser(User user, Long id) {
        return resumeAnalysisRepository.findByIdAndUser(id, user)
                .map(ResumeAnalysisResponse::from)
                .orElseThrow(() -> new IllegalArgumentException("Resume analysis not found"));
    }

    @Transactional
    public void process(Long analysisId) {
        ResumeAnalysis analysis = resumeAnalysisRepository.findById(analysisId)
                .orElseThrow(() -> new IllegalArgumentException("Resume analysis not found"));

        try {
            analysis.markProcessing();
            resumeAnalysisRepository.save(analysis);

            byte[] pdfBytes = resumeStorageService.download(analysis.getS3Key());
            String resumeText = pdfTextExtractor.extract(pdfBytes);
            FastApiResumeAnalysisResponse result = analyzerClient.analyze(resumeText);

            analysis.markCompleted(
                    result.atsScore(),
                    result.missingKeywords(),
                    result.missingTechnicalSkills(),
                    result.strengths(),
                    result.weaknesses(),
                    result.suggestedImprovements()
            );
            ResumeAnalysis savedAnalysis = resumeAnalysisRepository.save(analysis);
            snowflakeAnalyticsWriter.write(savedAnalysis);
        } catch (Exception exception) {
            analysis.markFailed(exception.getMessage());
            resumeAnalysisRepository.save(analysis);
        }
    }

    private void validatePdf(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Resume PDF is required");
        }

        if (!"application/pdf".equalsIgnoreCase(file.getContentType())) {
            throw new IllegalArgumentException("Only PDF resumes are supported");
        }
    }
}
