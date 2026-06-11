package com.skillora.ai.repository;

import com.skillora.ai.model.SkillGapAnalysis;
import com.skillora.auth.model.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillGapAnalysisRepository extends JpaRepository<SkillGapAnalysis, Long> {

    Optional<SkillGapAnalysis> findTopByUserOrderByCreatedAtDesc(User user);
}
