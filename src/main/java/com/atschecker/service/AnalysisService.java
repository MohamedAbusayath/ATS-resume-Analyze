package com.atschecker.service;

import com.atschecker.dto.AnalysisResponse;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface AnalysisService {
    AnalysisResponse analyze(MultipartFile file, String jobDescription) throws IOException;
}
