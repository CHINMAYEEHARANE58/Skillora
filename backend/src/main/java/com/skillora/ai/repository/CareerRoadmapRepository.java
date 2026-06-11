package com.skillora.ai.repository;

import com.skillora.ai.model.CareerRoadmap;
import com.skillora.auth.model.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CareerRoadmapRepository extends JpaRepository<CareerRoadmap, Long> {

    Optional<CareerRoadmap> findTopByUserOrderByCreatedAtDesc(User user);
}
