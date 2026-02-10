package com.atschecker.parser;

import org.apache.tika.Tika;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.io.InputStream;

@Component
public class ResumeParser {
    private final Tika tika = new Tika();

    public String parse(MultipartFile file) throws IOException {
        try (InputStream stream = file.getInputStream()) {
            String content = tika.parseToString(stream);
            if (content == null || content.trim().length() < 200) {
                throw new IOException(
                        "Extracted text is too short (< 200 chars). This might be an image-only resume or a corrupted file.");
            }
            return content;
        } catch (Exception e) {
            throw new IOException("Failed to parse file: " + e.getMessage(), e);
        }
    }
}
