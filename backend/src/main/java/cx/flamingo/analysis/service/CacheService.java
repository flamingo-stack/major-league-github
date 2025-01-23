package cx.flamingo.analysis.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.BasicFileAttributes;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Supplier;
import java.util.concurrent.ConcurrentHashMap;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import cx.flamingo.analysis.exception.GithubRateLimitException;
import cx.flamingo.analysis.exception.GithubTimeoutException;
import cx.flamingo.analysis.model.City;
import cx.flamingo.analysis.model.Contributor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class CacheService {

    @Value("${github.cache.path}")
    private String githubCachePath;

    @Value("${http.cache.path}")
    private String httpCachePath;

    @Value("${github.cache.refresh.interval}")
    private long githubRefreshIntervalMs;

    @Value("${http.cache.refresh.interval}")
    private long httpRefreshIntervalMs;

    private final ObjectMapper objectMapper;

    // private final ConcurrentHashMap<String, CachedResponse<List<Contributor>>> cache = new ConcurrentHashMap<>();
    @Value("${cache.expiration.ms:3600000}")
    private long cacheExpirationMs;

    @Data
    private static class CachedResponse<T> {

        private final T data;
        private final long timestamp;
    }

    public CacheService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    private void init() {
        createCacheDirectory(githubCachePath);
        createCacheDirectory(httpCachePath);
    }

    private void createCacheDirectory(String path) {
        try {
            Files.createDirectories(Paths.get(path));
            log.info("Cache directory created at: {}", path);
        } catch (IOException e) {
            log.error("Failed to create cache directory: {}", e.getMessage());
        }
    }

    private boolean isCacheEntryStale(Path filePath, long refreshInterval) {
        try {
            BasicFileAttributes attrs = Files.readAttributes(filePath, BasicFileAttributes.class);
            Instant lastModified = attrs.lastModifiedTime().toInstant();
            Duration age = Duration.between(lastModified, Instant.now());

            boolean isStale = age.toMillis() > refreshInterval;
            if (isStale) {
                log.info("Cache entry is stale (age: {} hours): {}", age.toHours(), filePath);
            }
            return isStale;
        } catch (IOException e) {
            log.error("Error checking cache entry age: {}", e.getMessage());
            return true; // Consider it stale if we can't check
        }
    }

    /**
     * Specialized method for caching GitHub API responses
     */
    public Optional<JsonObject> getGitHubApiResponse(City city, String language, int pageNumber, Supplier<JsonObject> apiCall) throws GithubTimeoutException, GithubRateLimitException {
        String cacheKey = String.format("/%s/Contributors:%s:page_%d", city.getId(), language, pageNumber);
        Optional<Map<String, Object>> cachedResponse = get(githubCachePath, cacheKey, new TypeReference<Map<String, Object>>() {
        }, githubRefreshIntervalMs);
        if (cachedResponse.isPresent()) {
            log.debug("Cache hit for GitHub API response - city: {}, language: {}, page: {}",
                    city.getId(), language, pageNumber);
            return Optional.of(new Gson().toJsonTree(cachedResponse.get()).getAsJsonObject());
        }

        // Cache miss or stale entry - call the API
        JsonObject response = apiCall.get();
        if (response != null) {
            // Check if it's an empty response
            boolean isEmpty = !response.has("data")
                    || response.get("data").isJsonNull()
                    || (response.getAsJsonObject("data").has("search")
                    && response.getAsJsonObject("data")
                            .getAsJsonObject("search")
                            .getAsJsonArray("nodes")
                            .size() == 0);

            if (isEmpty) {
                log.info("Caching empty response for city {} to avoid future API calls", city.getId());
            }

            // Convert JsonObject to Map for storage
            Map<String, Object> responseMap = new Gson().fromJson(response, Map.class);
            put(githubCachePath, cacheKey, responseMap);
            return Optional.of(response);
        }

        return Optional.empty();
    }

    /**
     * Specialized method for caching HTTP responses
     */
    public Optional<List<Contributor>> getHttpResponse(
            String cityId,
            String regionId,
            String stateId,
            String teamId,
            String languageId,
            int maxResults,
            Supplier<List<Contributor>> supplier) {

        String cacheKey = generateCacheKey(cityId, regionId, stateId, teamId, languageId, maxResults);

        Optional<List<Contributor>> cachedResponse = get(httpCachePath, cacheKey, new TypeReference<List<Contributor>>() {
        }, httpRefreshIntervalMs);
        if (cachedResponse.isPresent()) {
            log.info("Cache hit for key: {}", cacheKey);
            return cachedResponse;
        }

        log.info("Cache miss for key: {}", cacheKey);

        try {
            List<Contributor> response = supplier.get();
            put(httpCachePath, cacheKey, response);
            return Optional.of(response);
        } catch (Exception e) {
            log.error("Error fetching data: {}", e.getMessage());
            return Optional.empty();
        }
    }

    private String generateCacheKey(String cityId, String regionId, String stateId, String teamId, String language, int maxResults) {
        return String.format("%s:%s:%s:%s:%s:%d",
                cityId != null ? cityId : "null",
                regionId != null ? regionId : "null",
                stateId != null ? stateId : "null",
                teamId != null ? teamId : "null",
                language,
                maxResults);
    }

    public <T> Optional<T> get(String cachePath, String key, TypeReference<T> typeRef, long refreshInterval) {
        Path filePath = Paths.get(cachePath, key + ".json");

        if (!Files.exists(filePath)) {
            log.debug("Cache miss for key: '{}'", key);
            return Optional.empty();
        }

        if (isCacheEntryStale(filePath, refreshInterval)) {
            log.debug("Cache entry is stale for key: '{}'", key);
            try {
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                log.error("Failed to delete stale cache file for key '{}': {}", key, e.getMessage());
            }
            return Optional.empty();
        }

        try {
            T value = objectMapper.readValue(filePath.toFile(), typeRef);
            log.info("Cache hit for key: '{}'", key);
            if (log.isDebugEnabled()) {
                log.debug("Cache value: {}", objectMapper.writeValueAsString(value));
            }
            return Optional.of(value);
        } catch (IOException e) {
            log.error("Failed to read cache for key '{}': {}", key, e.getMessage());
            return Optional.empty();
        }
    }

    public <T> void put(String cachePath, String key, T value) {
        Path filePath = Paths.get(cachePath, key + ".json");

        try {
            // Create parent directories if they don't exist
            Files.createDirectories(filePath.getParent());

            objectMapper.writeValue(filePath.toFile(), value);
            log.info("Cached value for key: '{}'", key);
            if (log.isDebugEnabled()) {
                log.debug("Cache value: {}", objectMapper.writeValueAsString(value));
            }
        } catch (IOException e) {
            log.error("Failed to write cache for key '{}': {}", key, e.getMessage());
        }
    }

    public void invalidate(String cachePath, String key) {
        Path filePath = Paths.get(cachePath, key + ".json");

        try {
            Files.deleteIfExists(filePath);
            log.info("Invalidated cache for key: '{}'", key);
        } catch (IOException e) {
            log.error("Failed to invalidate cache for key '{}': {}", key, e.getMessage());
        }
    }

    /**
     * Clears cache entries in the specified cache directory. If clearAll is
     * true, removes all entries. Otherwise, removes only entries older than the
     * refresh interval.
     */
    public void clear(String cachePath, long refreshInterval, boolean clearAll) {
        try {
            Files.walk(Paths.get(cachePath))
                    .filter(Files::isRegularFile)
                    .forEach(path -> {
                        try {
                            if (clearAll || isCacheEntryStale(path, refreshInterval)) {
                                Files.delete(path);
                                log.info("Deleted cache file: {}", path.getFileName());
                            }
                        } catch (IOException e) {
                            log.error("Failed to delete cache file {}: {}", path, e.getMessage());
                        }
                    });
            log.info("Cache cleanup completed for {}. Mode: {}", cachePath, clearAll ? "full clear" : "stale entries only");
        } catch (IOException e) {
            log.error("Failed to walk cache directory: {}", e.getMessage());
        }
    }

    /**
     * Clears all cache entries in both caches
     */
    public void clear() {
        clear(githubCachePath, githubRefreshIntervalMs, true);
        clear(httpCachePath, httpRefreshIntervalMs, true);
    }

    /**
     * Automatically clear stale cache entries every refresh interval
     */
    @ConditionalOnProperty(name = "scheduler.enabled", matchIfMissing = true)
    @Scheduled(fixedDelayString = "${github.cache.refresh.interval}")
    public void clearStale() {
        log.info("Starting scheduled cache cleanup...");
        clear(githubCachePath, githubRefreshIntervalMs, false);
        clear(httpCachePath, httpRefreshIntervalMs, false);
    }

    private boolean isExpired(CachedResponse<?> response) {
        return System.currentTimeMillis() - response.getTimestamp() > cacheExpirationMs;
    }
}
