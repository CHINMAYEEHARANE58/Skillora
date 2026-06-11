package com.skillora.config;

import com.skillora.resume.dto.ResumeAnalysisRequestedEvent;
import java.util.HashMap;
import java.util.Map;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.kafka.support.serializer.JsonSerializer;

@Configuration
public class KafkaConfig {

    @Bean
    public ProducerFactory<String, ResumeAnalysisRequestedEvent> resumeProducerFactory(
            @Value("${spring.kafka.bootstrap-servers}") String bootstrapServers
    ) {
        Map<String, Object> properties = new HashMap<>();
        properties.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        properties.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        properties.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        properties.put(JsonSerializer.ADD_TYPE_INFO_HEADERS, false);
        return new DefaultKafkaProducerFactory<>(properties);
    }

    @Bean
    public KafkaTemplate<String, ResumeAnalysisRequestedEvent> resumeKafkaTemplate(
            ProducerFactory<String, ResumeAnalysisRequestedEvent> resumeProducerFactory
    ) {
        return new KafkaTemplate<>(resumeProducerFactory);
    }

    @Bean
    public ConsumerFactory<String, ResumeAnalysisRequestedEvent> resumeConsumerFactory(
            @Value("${spring.kafka.bootstrap-servers}") String bootstrapServers
    ) {
        JsonDeserializer<ResumeAnalysisRequestedEvent> deserializer =
                new JsonDeserializer<>(ResumeAnalysisRequestedEvent.class);
        deserializer.addTrustedPackages("com.skillora.resume.dto");

        Map<String, Object> properties = new HashMap<>();
        properties.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        properties.put(ConsumerConfig.GROUP_ID_CONFIG, "skillora-resume-analyzer");
        properties.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        return new DefaultKafkaConsumerFactory<>(properties, new StringDeserializer(), deserializer);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, ResumeAnalysisRequestedEvent> resumeKafkaListenerContainerFactory(
            ConsumerFactory<String, ResumeAnalysisRequestedEvent> resumeConsumerFactory
    ) {
        ConcurrentKafkaListenerContainerFactory<String, ResumeAnalysisRequestedEvent> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(resumeConsumerFactory);
        return factory;
    }
}
