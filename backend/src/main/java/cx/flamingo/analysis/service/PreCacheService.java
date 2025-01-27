package cx.flamingo.analysis.service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import cx.flamingo.analysis.cache.CacheServiceAbs;
import cx.flamingo.analysis.controller.ContributorController;
import cx.flamingo.analysis.model.Language;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class PreCacheService {

    @Autowired
    ContributorController contributorController;

    @Autowired
    LanguageService languageService;

    @Autowired
    CacheServiceAbs cacheService;

    @Scheduled(initialDelay = 1000, fixedDelayString = "${github.cache.refresh.interval:3600000}")
    void runFullCacheCycle() {
        Instant startTime = Instant.now();
        log.info("Starting cache refresh cycle for all languages...");
        List<Language> languages = languageService.getAllLanguages();

        for (Language language : languages) {
            try {
                log.info("Refreshing cache for language {}", language.getName());
                // Force cache refresh for all cities
                contributorController.getContributors(null, null, null, null, language.getId(), 15, GithubService.GithubApiPriority.Low);
            } catch (Exception e) {
                log.error("Error fetching contributors for language {}: {}", language.getName(), e.getMessage());
            }
        }

        cacheService.setCacheIsReady(true);

        Duration totalDuration = Duration.between(startTime, Instant.now());
        log.info("Cache refresh completed for {} languages in {} minutes and {} seconds",
                languages.size(),
                totalDuration.toMinutes(),
                totalDuration.getSeconds() % 60);
    }
}
