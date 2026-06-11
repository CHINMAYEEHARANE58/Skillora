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
@Table(name = "career_roadmaps")
public class CareerRoadmap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 160)
    private String targetRole;

    @Column(nullable = false)
    private Integer availableWeeks;

    @Column(nullable = false)
    private Integer hoursPerWeek;

    @Column(nullable = false)
    private Integer progress = 15;

    @Lob
    @Column(nullable = false)
    private String summary;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "career_roadmap_steps", joinColumns = @JoinColumn(name = "roadmap_id"))
    @Column(name = "step", length = 2000)
    private List<String> roadmapSteps = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "career_roadmap_milestones", joinColumns = @JoinColumn(name = "roadmap_id"))
    @Column(name = "milestone", length = 1000)
    private List<String> milestones = new ArrayList<>();

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    protected CareerRoadmap() {
    }

    public CareerRoadmap(
            User user,
            String targetRole,
            Integer availableWeeks,
            Integer hoursPerWeek,
            String summary,
            List<String> roadmapSteps,
            List<String> milestones
    ) {
        this.user = user;
        this.targetRole = targetRole;
        this.availableWeeks = availableWeeks;
        this.hoursPerWeek = hoursPerWeek;
        this.summary = summary;
        this.roadmapSteps = roadmapSteps;
        this.milestones = milestones;
    }

    public Long getId() {
        return id;
    }

    public String getTargetRole() {
        return targetRole;
    }

    public Integer getAvailableWeeks() {
        return availableWeeks;
    }

    public Integer getHoursPerWeek() {
        return hoursPerWeek;
    }

    public Integer getProgress() {
        return progress;
    }

    public String getSummary() {
        return summary;
    }

    public List<String> getRoadmapSteps() {
        return roadmapSteps;
    }

    public List<String> getMilestones() {
        return milestones;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
