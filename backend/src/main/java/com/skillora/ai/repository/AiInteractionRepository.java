package com.skillora.ai.repository;

import com.skillora.ai.model.AiInteraction;
import com.skillora.auth.model.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AiInteractionRepository extends JpaRepository<AiInteraction, Long> {

    long countByUser(User user);

    List<AiInteraction> findTop8ByUserOrderByCreatedAtDesc(User user);
}
