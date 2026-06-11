package com.skillora.resume.repository;

import com.skillora.auth.model.User;
import com.skillora.resume.model.ResumeAnalysis;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResumeAnalysisRepository extends JpaRepository<ResumeAnalysis, Long> {

    List<ResumeAnalysis> findByUserOrderByCreatedAtDesc(User user);

    Optional<ResumeAnalysis> findByIdAndUser(Long id, User user);

    Optional<ResumeAnalysis> findTopByUserOrderByCreatedAtDesc(User user);
}
