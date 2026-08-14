package cx.flamingo.analysis.service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import cx.flamingo.analysis.cache.CacheServiceAbs;
import cx.flamingo.analysis.model.Language;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class PreCacheService {

    private final ContributorService contributorService;

    private final LanguageService languageService;

    private final CacheServiceAbs cacheService;

    // Always run the cache refresh cycle on startup
    @Scheduled(initialDelay = 1000l, fixedDelay = 3600000l)
    void runFullCacheCycle() {
        Instant startTime = Instant.now();
        log.info("Starting cache refresh cycle for all languages...");
        List<Language> languages = languageService.getAllLanguages();

        int successCount = 0;
        for (Language language : languages) {
            try {
                log.info("Refreshing cache for language {}", language.getName());
                // Force cache refresh for all cities
                contributorService.getContributors(null, null, null, null, language.getId(), 15,
                        GithubService.GithubApiPriority.Low);
                successCount++;
            } catch (Exception e) {
                log.error("Error fetching contributors for language {}: {}", language.getName(), e.getMessage());
            }
        }

        if (successCount > 0) {
            cacheService.setCacheIsReady(true);
        } else {
            log.warn("Cache refresh cycle completed with 0 successful languages; cache NOT marked as ready.");
        }

        Duration totalDuration = Duration.between(startTime, Instant.now());
        log.info("Cache refresh completed for {}/{} languages in {} minutes and {} seconds",
                successCount,
                languages.size(),
                totalDuration.toMinutes(),
                totalDuration.getSeconds() % 60);
    }
}
