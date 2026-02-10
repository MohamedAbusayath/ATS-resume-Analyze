package com.atschecker.scorer;

import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;

@Component
public class AtsScorer {

    public int calculateScore(int matchedCount, int totalCount, String resumeText, List<String> warnings) {
        if (totalCount == 0)
            return 0;

        // 1. Skill Match Score (50)
        double skillMatchScore = ((double) matchedCount / totalCount) * 50;

        // 2. Section Completeness (25)
        double sectionScore = calculateSectionScore(resumeText, warnings);

        // 3. Formatting Quality (15)
        double formattingScore = calculateFormattingScore(resumeText, warnings);

        // 4. Keyword Frequency/Density (10)
        // Deterministic: if more than 5 keywords match, give full 10 points
        double frequencyScore = (matchedCount >= 5) ? 10 : (matchedCount * 2.0);

        int finalScore = (int) (skillMatchScore + sectionScore + formattingScore + frequencyScore);
        return Math.min(100, Math.max(0, finalScore));
    }

    private double calculateSectionScore(String text, List<String> warnings) {
        String lowerText = text.toLowerCase();

        int foundMajorSections = 0;
        if (containsAny(lowerText, "experience", "work experience", "employment"))
            foundMajorSections++;
        if (containsAny(lowerText, "education", "academic"))
            foundMajorSections++;
        if (containsAny(lowerText, "skills", "technical skills"))
            foundMajorSections++;
        if (containsAny(lowerText, "projects"))
            foundMajorSections++;
        if (containsAny(lowerText, "contact", "email", "phone"))
            foundMajorSections++;

        if (foundMajorSections < 4) {
            warnings.add("Common resume sections (Experience, Education, Skills) were not clearly detected.");
        }

        return (foundMajorSections / 5.0) * 25;
    }

    private double calculateFormattingScore(String text, List<String> warnings) {
        double score = 15;

        // Excess symbols check
        long symbolCount = text.chars().filter(ch -> !Character.isLetterOrDigit(ch) && !Character.isWhitespace(ch))
                .count();
        if (symbolCount > text.length() * 0.1) {
            warnings.add("Excessive special characters/symbols detected. This can confuse ATS parsers.");
            score -= 5;
        }

        // Low text density check (if many line breaks relative to text)
        String[] lines = text.split("\n");
        if (lines.length > text.length() / 20) {
            warnings.add("Too many line breaks detected. Ensure your layout isn't overly fragmented.");
            score -= 3;
        }

        // Minimal length check
        if (text.length() < 300) {
            warnings.add("Extracted text length is very low. Ensure your document is text-based and not an image.");
            score -= 7;
        }

        return Math.max(0, score);
    }

    private boolean containsAny(String text, String... keywords) {
        for (String kw : keywords) {
            if (text.contains(kw))
                return true;
        }
        return false;
    }
}
