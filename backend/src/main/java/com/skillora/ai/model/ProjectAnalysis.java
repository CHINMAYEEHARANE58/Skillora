package com.skillora.ai.model;

import com.skillora.auth.model.User;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "project_analyses")
public class ProjectAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Lob
    @Column(nullable = false)
    private String projectDescription;

    @Lob
    @Column(nullable = false)
    private String summary;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_resume_improvements", joinColumns = @JoinColumn(name = "analysis_id"))
    @Column(name = "improvement", length = 1000)
    private List<String> resumeImprovements = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_scalability_suggestions", joinColumns = @JoinColumn(name = "analysis_id"))
    @Column(name = "suggestion", length = 1000)
    private List<String> scalabilitySuggestions = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_missing_technologies", joinColumns = @JoinColumn(name = "analysis_id"))
    @Column(name = "technology")
    private List<String> missingTechnologies = new ArrayList<>();

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    protected ProjectAnalysis() {
    }

    public ProjectAnalysis(
            User user,
            String projectDescription,
            String summary,
            List<String> resumeImprovements,
            List<String> scalabilitySuggestions,
            List<String> missingTechnologies
    ) {
        this.user = user;
        this.projectDescription = projectDescription;
        this.summary = summary;
        this.resumeImprovements = resumeImprovements;
        this.scalabilitySuggestions = scalabilitySuggestions;
        this.missingTechnologies = missingTechnologies;
    }

    public Long getId() {
        return id;
    }

    public String getSummary() {
        return summary;
    }

    public List<String> getResumeImprovements() {
        return resumeImprovements;
    }

    public List<String> getScalabilitySuggestions() {
        return scalabilitySuggestions;
    }

    public List<String> getMissingTechnologies() {
        return missingTechnologies;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
