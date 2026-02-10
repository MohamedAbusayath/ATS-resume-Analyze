package com.atschecker.service.impl;

import com.atschecker.analyzer.KeywordAnalyzer;
import com.atschecker.dto.AnalysisResponse;
import com.atschecker.parser.ResumeParser;
import com.atschecker.scorer.AtsScorer;
import com.atschecker.service.AnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalysisServiceImpl implements AnalysisService {

    private final ResumeParser resumeParser;
    private final KeywordAnalyzer keywordAnalyzer;
    private final AtsScorer atsScorer;

    public AnalysisServiceImpl(ResumeParser resumeParser, KeywordAnalyzer keywordAnalyzer, AtsScorer atsScorer) {
        this.resumeParser = resumeParser;
        this.keywordAnalyzer = keywordAnalyzer;
        this.atsScorer = atsScorer;
    }

    @Override
    public AnalysisResponse analyze(MultipartFile file, String jobDescription) throws IOException {
        String resumeText = resumeParser.parse(file);
        Set<String> jdKeywords = keywordAnalyzer.extractKeywords(jobDescription);

        List<String> matchedKeywords = keywordAnalyzer.findMatches(resumeText, jdKeywords);

        Set<String> matchedSet = new HashSet<>(matchedKeywords);
        List<String> missingKeywords = jdKeywords.stream()
                .filter(k -> !matchedSet.contains(k))
                .limit(10) // Limit suggestions
                .collect(Collectors.toList());

        List<String> warnings = new ArrayList<>();
        int score = atsScorer.calculateScore(matchedKeywords.size(), jdKeywords.size(), resumeText, warnings);

        List<String> suggestions = new ArrayList<>();
        if (!missingKeywords.isEmpty()) {
            suggestions.add("Consider adding keywords like: "
                    + String.join(", ", missingKeywords.subList(0, Math.min(5, missingKeywords.size()))));
        }
        if (score < 70) {
            suggestions.add("Tailor your work experience bullets to match the job requirements more closely.");
        }

        return new AnalysisResponse(score, matchedKeywords, missingKeywords, warnings, suggestions);
    }
}
