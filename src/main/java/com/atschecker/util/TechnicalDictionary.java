package com.atschecker.util;

import java.util.*;

public class TechnicalDictionary {
    // Map of lowercase skill to its Professional Display Name
    // This is the MANDATORY dictionary. If a word isn't here, it isn't a skill.
    public static final Map<String, String> SKILLS_MAP = new LinkedHashMap<>();

    static {
        // Programming Languages
        add("Java");
        add("JavaScript");
        add("TypeScript");
        add("Python");
        add("C#");
        add("C++");
        add("Ruby");
        add("Go");
        add("Golang");
        add("Swift");
        add("Kotlin");
        add("PHP");
        add("Rust");
        add("SQL");
        add("HTML");
        add("CSS");
        add("SASS");
        add("LESS");
        add("R");
        add("Scala");
        add("Dart");
        add("MATLAB");
        add("Perl");
        add("Haskell");

        // Frameworks & Libraries
        add("Spring");
        add("Spring Boot");
        add("React");
        add("Angular");
        add("Vue");
        add("Node.js");
        add("Express");
        add("Django");
        add("Flask");
        add("Laravel");
        add("Rails");
        add("ASP.NET");
        add("dotNet");
        add("Spring MVC");
        add("Spring Security");
        add("Next.js");
        add("Nuxt");
        add("Svelte");
        add("jQuery");
        add("Bootstrap");
        add("Tailwind");
        add("MUI");
        add("Material UI");
        add("Redux");
        add("RxJS");
        add("Hibernate");
        add("JPA");
        add("MyBatis");
        add("JUnit");
        add("Mockito");
        add("Selenium");
        add("Jest");
        add("Cypress");
        add("Flutter");
        add("React Native");
        add("TensorFlow");
        add("PyTorch");
        add("Pandas");
        add("NumPy");
        add("Spark");

        // Databases
        add("MySQL");
        add("PostgreSQL");
        add("Postgres");
        add("MongoDB");
        add("Redis");
        add("Oracle");
        add("SQL Server");
        add("SQLite");
        add("Cassandra");
        add("DynamoDB");
        add("MariaDB");
        add("Elasticsearch");
        add("Neo4j");
        add("Firebase");
        add("CouchDB");

        // Cloud & platforms
        add("AWS");
        add("Azure");
        add("GCP");
        add("Google Cloud");
        add("Heroku");
        add("Netlify");
        add("Vercel");
        add("DigitalOcean");
        add("AWS S3");
        add("AWS EC2");
        add("AWS Lambda");
        add("Amplify");
        add("Cloudfront");
        add("Route53");

        // DevOps & Orchestration
        add("Docker");
        add("Kubernetes");
        add("K8s");
        add("Jenkins");
        add("Git");
        add("GitHub");
        add("GitLab");
        add("Bitbucket");
        add("Ansible");
        add("Terraform");
        add("CI/CD");
        add("CircleCI");
        add("Travis CI");
        add("Maven");
        add("Gradle");
        add("npm");
        add("Yarn");
        add("pip");
        add("Prometheus");
        add("Grafana");
        add("Splunk");
        add("Linux");
        add("Ubuntu");
        add("Debian");
        add("CentOS");
        add("Nginx");
        add("Apache");
        add("RabbitMQ");
        add("Kafka");
        add("ActiveMQ");

        // APIs & Protocols
        add("REST");
        add("RESTful");
        add("RESTful APIs");
        add("SOAP");
        add("GraphQL");
        add("gRPC");
        add("JSON");
        add("XML");
        add("HTTP");
        add("HTTPS");
        add("OAuth");
        add("JWT");
        add("WebSocket");
        add("Web API");

        // Core Concepts & Methods (Allowed hiring keywords)
        add("Algorithms");
        add("Data Structures");
        add("Backend");
        add("Frontend");
        add("Full Stack");
        add("Microservices");
        add("Unit Testing");
        add("Integration Testing");
        add("ORM");
        add("MVC");
        add("API");
        add("UI");
        add("UX");
        add("SDLC");
        add("Object-Oriented Programming");
        add("OOP");
        add("Design Patterns");
        add("Agile");
        add("Scrum");
        add("Kanban");
        add("TDD");
        add("BDD");

        // Project Management
        add("Jira");
        add("Confluence");
        add("Trello");
        add("Asana");
    }

    private static void add(String skill) {
        SKILLS_MAP.put(skill.toLowerCase(), skill);
    }

    // Explicitly blocked list to prevent accidental matching or inflation
    public static final Set<String> BLOCKED = new HashSet<>(Arrays.asList(
            "software", "based", "using", "are", "computer", "experience", "programming", "development",
            "solutions", "technologies", "technology", "technical", "final", "your", "years", "would",
            "bit", "authorized", "building", "analyzing", "various", "quality", "professional", "highly",
            "ability", "team", "work", "level", "strong", "excellent", "role", "summary", "hands",
            "seeking", "this", "that", "and", "the", "for", "with", "about", "against", "from", "at",
            "his", "her", "must", "have", "preferred", "requirements", "responsibilities", "candidate",
            "position", "company", "applications", "knowledge", "skills", "tools", "expert", "lead",
            "senior", "junior", "mid", "basic"));
}
