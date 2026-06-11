package com.skillora.config;

import com.skillora.auth.model.Role;
import com.skillora.auth.model.User;
import com.skillora.auth.repository.UserRepository;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    @Bean
    public CommandLineRunner seedDemoUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() > 0) {
                log.info("Demo user seed skipped because users already exist");
                return;
            }

            User admin = new User(
                    "Skillora Admin",
                    "admin@skillora.ai",
                    passwordEncoder.encode("Admin@123"),
                    Set.of(Role.ADMIN, Role.USER)
            );
            User student = new User(
                    "Skillora Student",
                    "student@skillora.ai",
                    passwordEncoder.encode("Student@123"),
                    Set.of(Role.USER)
            );

            userRepository.save(admin);
            userRepository.save(student);
            log.info("Seeded demo users: admin@skillora.ai and student@skillora.ai");
        };
    }
}
