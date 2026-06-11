package com.skillora.resume.model;

import com.skillora.auth.model.User;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "resume_analyses")
public class ResumeAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String s3Key;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResumeAnalysisStatus status = ResumeAnalysisStatus.QUEUED;

    private Integer atsScore;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "resume_missing_keywords", joinColumns = @JoinColumn(name = "analysis_id"))
    @Column(name = "keyword")
    private List<String> missingKeywords = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "resume_missing_technical_skills", joinColumns = @JoinColumn(name = "analysis_id"))
    @Column(name = "skill")
    private List<String> missingTechnicalSkills = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "resume_strengths", joinColumns = @JoinColumn(name = "analysis_id"))
    @Column(name = "strength", length = 1000)
    private List<String> strengths = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "resume_weaknesses", joinColumns = @JoinColumn(name = "analysis_id"))
    @Column(name = "weakness", length = 1000)
    private List<String> weaknesses = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "resume_suggestions", joinColumns = @JoinColumn(name = "analysis_id"))
    @Column(name = "suggestion", length = 1000)
    private List<String> suggestedImprovements = new ArrayList<>();

    @Column(length = 1000)
    private String failureReason;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    private Instant completedAt;

    protected ResumeAnalysis() {
    }

    public ResumeAnalysis(User user, String fileName, String s3Key) {
        this.user = user;
        this.fileName = fileName;
        this.s3Key = s3Key;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public String getFileName() {
        return fileName;
    }

    public String getS3Key() {
        return s3Key;
    }

    public ResumeAnalysisStatus getStatus() {
        return status;
    }

    public Integer getAtsScore() {
        return atsScore;
    }

    public List<String> getMissingKeywords() {
        return missingKeywords;
    }

    public List<String> getMissingTechnicalSkills() {
        return missingTechnicalSkills;
    }

    public List<String> getStrengths() {
        return strengths;
    }

    public List<String> getWeaknesses() {
        return weaknesses;
    }

    public List<String> getSuggestedImprovements() {
        return suggestedImprovements;
    }

    public String getFailureReason() {
        return failureReason;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getCompletedAt() {
        return completedAt;
    }

    public void markProcessing() {
        this.status = ResumeAnalysisStatus.PROCESSING;
    }

    public void markCompleted(
            Integer atsScore,
            List<String> missingKeywords,
            List<String> missingTechnicalSkills,
            List<String> strengths,
            List<String> weaknesses,
            List<String> suggestedImprovements
    ) {
        this.status = ResumeAnalysisStatus.COMPLETED;
        this.atsScore = atsScore;
        this.missingKeywords = missingKeywords;
        this.missingTechnicalSkills = missingTechnicalSkills;
        this.strengths = strengths;
        this.weaknesses = weaknesses;
        this.suggestedImprovements = suggestedImprovements;
        this.completedAt = Instant.now();
        this.failureReason = null;
    }

    public void markFailed(String failureReason) {
        this.status = ResumeAnalysisStatus.FAILED;
        this.failureReason = failureReason;
        this.completedAt = Instant.now();
    }
}
