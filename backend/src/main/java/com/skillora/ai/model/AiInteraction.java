package com.skillora.ai.model;

import com.skillora.auth.model.User;
import jakarta.persistence.Column;
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

@Entity
@Table(name = "ai_interactions")
public class AiInteraction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 80)
    private String feature;

    @Lob
    @Column(nullable = false)
    private String requestSummary;

    @Lob
    @Column(nullable = false)
    private String responseSummary;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    protected AiInteraction() {
    }

    public AiInteraction(User user, String feature, String requestSummary, String responseSummary) {
        this.user = user;
        this.feature = feature;
        this.requestSummary = requestSummary;
        this.responseSummary = responseSummary;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public String getFeature() {
        return feature;
    }

    public String getRequestSummary() {
        return requestSummary;
    }

    public String getResponseSummary() {
        return responseSummary;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
