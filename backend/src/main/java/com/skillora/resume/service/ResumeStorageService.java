package com.skillora.resume.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
public class ResumeStorageService {

    private final S3Client s3Client;
    private final String bucket;
    private final boolean localEnabled;
    private final Path localDirectory;

    public ResumeStorageService(
            S3Client s3Client,
            @Value("${skillora.aws.resume-bucket}") String bucket,
            @Value("${skillora.storage.local-enabled:false}") boolean localEnabled,
            @Value("${skillora.storage.local-directory:./data/resumes}") String localDirectory
    ) {
        this.s3Client = s3Client;
        this.bucket = bucket;
        this.localEnabled = localEnabled;
        this.localDirectory = Path.of(localDirectory);
    }

    public String upload(Long userId, MultipartFile file) throws IOException {
        String key = "users/%d/resumes/%s-%s".formatted(
                userId,
                UUID.randomUUID(),
                file.getOriginalFilename()
        );

        if (localEnabled) {
            Path target = localDirectory.resolve(key);
            Files.createDirectories(target.getParent());
            Files.write(target, file.getBytes());
            return key;
        }

        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType("application/pdf")
                .build();

        s3Client.putObject(request, RequestBody.fromBytes(file.getBytes()));
        return key;
    }

    public byte[] download(String key) throws IOException {
        if (localEnabled) {
            return Files.readAllBytes(localDirectory.resolve(key));
        }

        GetObjectRequest request = GetObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build();
        return s3Client.getObjectAsBytes(request).asByteArray();
    }
}
