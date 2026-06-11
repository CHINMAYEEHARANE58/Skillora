package com.skillora.resume.controller;

import com.skillora.auth.model.User;
import com.skillora.resume.dto.ResumeAnalysisResponse;
import com.skillora.resume.service.ResumeAnalysisService;
import java.io.IOException;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/resumes")
public class ResumeAnalysisController {

    private final ResumeAnalysisService resumeAnalysisService;

    public ResumeAnalysisController(ResumeAnalysisService resumeAnalysisService) {
        this.resumeAnalysisService = resumeAnalysisService;
    }

    @PostMapping("/upload")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResumeAnalysisResponse upload(
            @AuthenticationPrincipal User user,
            @RequestPart("file") MultipartFile file
    ) throws IOException {
        return resumeAnalysisService.upload(user, file);
    }

    @GetMapping
    public List<ResumeAnalysisResponse> findAll(@AuthenticationPrincipal User user) {
        return resumeAnalysisService.findForUser(user);
    }

    @GetMapping("/{id}")
    public ResumeAnalysisResponse findById(@AuthenticationPrincipal User user, @PathVariable Long id) {
        return resumeAnalysisService.findByIdForUser(user, id);
    }
}
