package com.atschecker.analyzer;

import com.atschecker.util.TechnicalDictionary;
import org.springframework.stereotype.Component;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Component
public class KeywordAnalyzer {

        /**
         * Extracts keywords strictly based on a mandatory technical skills dictionary.
         * Normal English words are discarded even if they pass stop-word filters.
         */
        public Set<String> extractKeywords(String text) {
                if (text == null || text.trim().isEmpty())
                        return Collections.emptySet();

                String lowerText = text.toLowerCase();
                Set<String> extracted = new LinkedHashSet<>(); // Preserve insertion order for better display

                // 1. Process Multi-word phrases first (e.g., "Spring Boot", "Data Structures")
                // This ensures "Spring Boot" is caught before single word "Spring"
                for (Map.Entry<String, String> entry : TechnicalDictionary.SKILLS_MAP.entrySet()) {
                        String skillKey = entry.getKey();
                        if (skillKey.contains(" ")) {
                                // Use regex with word boundaries for multi-word phrases too
                                String pattern = "\\b" + Pattern.quote(skillKey) + "\\b";
                                if (Pattern.compile(pattern).matcher(lowerText).find()) {
                                        extracted.add(entry.getValue());
                                }
                        }
                }

                // 2. Clean text for single-token processing
                // Replace everything except basic alphanumeric and technical symbols with
                // spaces
                String cleanText = lowerText
                                .replaceAll("[^a-z0-9\\s#+.]", " ")
                                .replaceAll("\\s+", " ")
                                .trim();

                String[] tokens = cleanText.split(" ");

                // 3. Process tokens against the mandatory technical dictionary
                for (String token : tokens) {
                        String t = token.trim();
                        if (t.isEmpty())
                                continue;

                        // Rule: Must not be in the explicitly blocked list
                        if (TechnicalDictionary.BLOCKED.contains(t))
                                continue;

                        // Rule: MUST be in the technical skills dictionary
                        if (TechnicalDictionary.SKILLS_MAP.containsKey(t)) {
                                extracted.add(TechnicalDictionary.SKILLS_MAP.get(t));
                        }
                }

                return extracted;
        }

        /**
         * Matches resumes against JD keywords using strict word boundaries.
         * This avoids false positives like matching "Java" in "Javascript".
         */
        public List<String> findMatches(String resumeText, Set<String> jdKeywords) {
                if (resumeText == null || jdKeywords.isEmpty())
                        return Collections.emptyList();

                String lowerResume = resumeText.toLowerCase();

                return jdKeywords.stream()
                                .filter(keyword -> {
                                        String lowerKw = keyword.toLowerCase();
                                        // Normalize the pattern with word boundaries
                                        String pattern = "\\b" + Pattern.quote(lowerKw) + "\\b";

                                        // Specifically handle technical symbols which \b might not handle as expected
                                        if (lowerKw.endsWith("+") || lowerKw.endsWith("#") || lowerKw.contains(".")) {
                                                return lowerResume.contains(lowerKw);
                                        }

                                        try {
                                                return Pattern.compile(pattern).matcher(lowerResume).find();
                                        } catch (Exception e) {
                                                return lowerResume.contains(lowerKw);
                                        }
                                })
                                .sorted()
                                .collect(Collectors.toList());
        }
}
