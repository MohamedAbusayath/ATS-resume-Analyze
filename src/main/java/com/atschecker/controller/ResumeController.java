package com.atschecker.controller;

import com.atschecker.dto.AnalysisResponse;
import com.atschecker.service.AnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@RestController
@RequestMapping("/api/resume")
@CrossOrigin(origins = "*") // For local development with React
public class ResumeController {

    private final AnalysisService analysisService;

    public ResumeController(AnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("ATS Checker Backend is running");
    }

    @PostMapping("/analyze")
    public ResponseEntity<AnalysisResponse> analyze(
            @RequestParam("file") MultipartFile file,
            @RequestParam("jobDescription") String jobDescription) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            AnalysisResponse response = analysisService.analyze(file, jobDescription);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
