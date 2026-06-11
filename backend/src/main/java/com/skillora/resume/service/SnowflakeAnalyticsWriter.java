package com.skillora.resume.service;

import com.skillora.ai.model.AiInteraction;
import com.skillora.resume.model.ResumeAnalysis;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.Timestamp;
import java.util.Properties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SnowflakeAnalyticsWriter {

    private static final Logger log = LoggerFactory.getLogger(SnowflakeAnalyticsWriter.class);

    private final boolean enabled;
    private final String url;
    private final String username;
    private final String password;
    private final String database;
    private final String schema;
    private final String warehouse;

    public SnowflakeAnalyticsWriter(
            @Value("${skillora.snowflake.enabled}") boolean enabled,
            @Value("${skillora.snowflake.url}") String url,
            @Value("${skillora.snowflake.username}") String username,
            @Value("${skillora.snowflake.password}") String password,
            @Value("${skillora.snowflake.database}") String database,
            @Value("${skillora.snowflake.schema}") String schema,
            @Value("${skillora.snowflake.warehouse}") String warehouse
    ) {
        this.enabled = enabled;
        this.url = url;
        this.username = username;
        this.password = password;
        this.database = database;
        this.schema = schema;
        this.warehouse = warehouse;
    }

    public void write(ResumeAnalysis analysis) {
        if (!enabled) {
            return;
        }

        Properties properties = new Properties();
        properties.put("user", username);
        properties.put("password", password);
        properties.put("db", database);
        properties.put("schema", schema);
        properties.put("warehouse", warehouse);

        String sql = """
                insert into RESUME_ANALYTICS
                    (ANALYSIS_ID, USER_ID, FILE_NAME, ATS_SCORE, STATUS, CREATED_AT, COMPLETED_AT)
                values (?, ?, ?, ?, ?, ?, ?)
                """;

        try (Connection connection = DriverManager.getConnection(url, properties);
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, analysis.getId());
            statement.setLong(2, analysis.getUser().getId());
            statement.setString(3, analysis.getFileName());
            statement.setObject(4, analysis.getAtsScore());
            statement.setString(5, analysis.getStatus().name());
            statement.setTimestamp(6, Timestamp.from(analysis.getCreatedAt()));
            statement.setTimestamp(7, Timestamp.from(analysis.getCompletedAt()));
            statement.executeUpdate();
        } catch (Exception exception) {
            log.warn("Failed to write resume analytics to Snowflake: {}", exception.getMessage());
        }
    }

    public void writeAiUsage(AiInteraction interaction) {
        if (!enabled) {
            return;
        }

        Properties properties = new Properties();
        properties.put("user", username);
        properties.put("password", password);
        properties.put("db", database);
        properties.put("schema", schema);
        properties.put("warehouse", warehouse);

        String sql = """
                insert into AI_USAGE_METRICS
                    (INTERACTION_ID, USER_ID, FEATURE, REQUEST_SUMMARY, RESPONSE_SUMMARY, CREATED_AT)
                values (?, ?, ?, ?, ?, ?)
                """;

        try (Connection connection = DriverManager.getConnection(url, properties);
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, interaction.getId());
            statement.setLong(2, interaction.getUser().getId());
            statement.setString(3, interaction.getFeature());
            statement.setString(4, interaction.getRequestSummary());
            statement.setString(5, interaction.getResponseSummary());
            statement.setTimestamp(6, Timestamp.from(interaction.getCreatedAt()));
            statement.executeUpdate();
        } catch (Exception exception) {
            log.warn("Failed to write AI usage metrics to Snowflake: {}", exception.getMessage());
        }
    }
}
