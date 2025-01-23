package cx.flamingo.analysis.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import cx.flamingo.analysis.model.Language;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class LanguageService {
    private List<Language> languages;

    @PostConstruct
    public void init() {
        loadLanguages();
        log.info("Loaded {} languages", languages.size());
    }

    private void loadLanguages() {
        languages = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(new ClassPathResource("data/languages.csv").getInputStream()))) {
            
            // Skip header
            reader.readLine();
            
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(",");
                String id = parts[0];
                String name = parts[1];
                String displayName = parts[2];
                String iconUrl = parts[3];
                
                Language language = Language.builder()
                    .id(id)
                    .name(name)
                    .displayName(displayName)
                    .iconUrl(iconUrl)
                    .build();
                
                languages.add(language);
            }
        } catch (IOException e) {
            log.error("Error loading languages from CSV", e);
            throw new RuntimeException("Failed to load languages", e);
        }
    }

    public List<Language> autocompleteLanguages(String query, int maxResults) {
        Stream<Language> languageStream = languages.stream();

        if (query != null && !query.isEmpty()) {
            String lowerQuery = query.toLowerCase();
            languageStream = languageStream.filter(language -> 
                language.getName().toLowerCase().contains(lowerQuery) ||
                language.getDisplayName().toLowerCase().contains(lowerQuery));
        }

        return languageStream
            .limit(maxResults)
            .collect(Collectors.toList());
    }

    public Language getLanguageById(String id) {
        return languages.stream()
            .filter(l -> l.getId().equals(id))
            .findFirst()
            .orElse(null);
    }

    public List<Language> getAllLanguages() {
        return new ArrayList<>(languages);
    }

    public Language getDefaultLanguage() {
        return languages.stream()
            .filter(l -> l.getName().equalsIgnoreCase("Java"))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Default language (Java) not found"));
    }
} 