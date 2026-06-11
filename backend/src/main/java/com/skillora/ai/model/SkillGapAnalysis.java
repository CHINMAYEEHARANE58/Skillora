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
@Table(name = "skill_gap_analyses")
public class SkillGapAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 160)
    private String targetRole;

    @Column(length = 160)
    private String company;

    @Lob
    @Column(nullable = false)
    private String summary;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "skill_gap_missing_skills", joinColumns = @JoinColumn(name = "analysis_id"))
    @Column(name = "skill", length = 1000)
    private List<String> missingSkills = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "skill_gap_priority_ranking", joinColumns = @JoinColumn(name = "analysis_id"))
    @Column(name = "priority_item", length = 1000)
    private List<String> priorityRanking = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "skill_gap_learning_recommendations", joinColumns = @JoinColumn(name = "analysis_id"))
    @Column(name = "recommendation", length = 1000)
    private List<String> learningRecommendations = new ArrayList<>();

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    protected SkillGapAnalysis() {
    }

    public SkillGapAnalysis(
            User user,
            String targetRole,
            String company,
            String summary,
            List<String> missingSkills,
            List<String> priorityRanking,
            List<String> learningRecommendations
    ) {
        this.user = user;
        this.targetRole = targetRole;
        this.company = company;
        this.summary = summary;
        this.missingSkills = missingSkills;
        this.priorityRanking = priorityRanking;
        this.learningRecommendations = learningRecommendations;
    }

    public Long getId() {
        return id;
    }

    public String getTargetRole() {
        return targetRole;
    }

    public String getCompany() {
        return company;
    }

    public String getSummary() {
        return summary;
    }

    public List<String> getMissingSkills() {
        return missingSkills;
    }

    public List<String> getPriorityRanking() {
        return priorityRanking;
    }

    public List<String> getLearningRecommendations() {
        return learningRecommendations;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
