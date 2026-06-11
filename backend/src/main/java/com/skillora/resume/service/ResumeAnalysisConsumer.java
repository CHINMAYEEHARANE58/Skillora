package com.skillora.resume.service;

import com.skillora.resume.dto.ResumeAnalysisRequestedEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class ResumeAnalysisConsumer {

    private final ResumeAnalysisService resumeAnalysisService;

    public ResumeAnalysisConsumer(ResumeAnalysisService resumeAnalysisService) {
        this.resumeAnalysisService = resumeAnalysisService;
    }

    @KafkaListener(
            topics = "${skillora.kafka.resume-topic}",
            containerFactory = "resumeKafkaListenerContainerFactory",
            autoStartup = "${skillora.kafka.enabled:true}"
    )
    public void consume(ResumeAnalysisRequestedEvent event) {
        resumeAnalysisService.process(event.analysisId());
    }
}
