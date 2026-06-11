package com.skillora.ai.repository;

import com.skillora.ai.model.ProjectAnalysis;
import com.skillora.auth.model.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectAnalysisRepository extends JpaRepository<ProjectAnalysis, Long> {

    Optional<ProjectAnalysis> findTopByUserOrderByCreatedAtDesc(User user);
}
