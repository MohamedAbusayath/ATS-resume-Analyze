# ATS Resume Checker

Analyze resumes against job descriptions and calculate ATS compatibility score using explainable logic.

## Prerequisites

- Java 17
- Maven
- Node.js & npm

## How to Run

### Backend

1. Navigate to the root directory.
2. Run `mvn spring-boot:run`.
3. The server will start on `http://localhost:8080`.

### Frontend

1. Navigate to the `frontend` directory.
2. Run `npm install` (already done if you followed the setup).
3. Run `npm run dev`.
4. Open your browser and navigate to the URL provided (usually `http://localhost:5173`).

## Features

- **Resume Upload:** Supports PDF and DOCX formats.
- **Keyword Matching:** Extracts keywords from job descriptions and matches them with resume content.
- **ATS Scoring:** Calculates score based on skill match, section completeness, and formatting.
- **Actionable Insights:** Provides matched keywords, missing keywords, warnings, and suggestions.
