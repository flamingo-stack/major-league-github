package cx.flamingo.analysis.cache;

import java.time.Duration;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.function.Supplier;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;

import cx.flamingo.analysis.model.City;
import cx.flamingo.analysis.model.Contributor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public abstract class CacheServiceAbs {

    
    protected final String NONE = "NONE";

    protected final Gson gson;

    @Value("${github.cache.refresh.interval}")
    protected long githubRefreshIntervalMs;

    @Value("${http.cache.refresh.interval}")
    protected long httpRefreshIntervalMs;

    @Value("${cache.expiration.ms:3600000}")
    protected long cacheExpirationMs;

    public abstract String getDelimiter();

    @Data
    private static class CachedResponse<T> {

        private final T data;
        private final long timestamp;
    }

    protected CacheServiceAbs(Gson gson) {
        this.gson = gson;
    }

    protected abstract Long getInsertTime(String cachePath, String key);

    protected boolean isCacheEntryStale(String cachePath, String key, long refreshInterval) {
        try {
            Long lastModified = getInsertTime(cachePath, key);
            Long age = System.currentTimeMillis() - lastModified;
            boolean isStale = age > refreshInterval;
            if (isStale) {
                log.info("Cache entry is stale (age: {} minutes): {}", Duration.ofMillis(age).toMinutes(), cachePath + ":" + key);
            }
            return isStale;
        } catch (Throwable e) {
            log.error("Error checking cache entry age: {}", e.getMessage());
            return true; // Consider it stale if we can't check
        }
    }

    /**
     * Specialized method for caching GitHub API responses
     */
    public Optional<JsonObject> getGitHubApiResponse(City city, String language, int pageNumber, Supplier<JsonObject> supplier) {
        String cacheKey = generateGithubCacheKey(city, language, pageNumber);
        Optional<JsonObject> cachedResponse = get(getGithubCachePath(), cacheKey, new TypeToken<JsonObject>() {
        }, githubRefreshIntervalMs);

        if (cachedResponse.isPresent() && isCacheEntryStale(getGithubCachePath(), cacheKey, githubRefreshIntervalMs)) {
            invalidate(getGithubCachePath(), cacheKey);
            // Start async refresh but don't wait for it
            doHttpCallAsync(supplier, getGithubCachePath(), cacheKey);
        }

        if (cachedResponse.isPresent()) {
            log.debug("Cache hit for GitHub API response - city: {}, language: {}, page: {}",
                    city.getId(), language, pageNumber);
            return cachedResponse;
        }

        return doHttpCall(supplier, getGithubCachePath(), cacheKey);
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

        Optional<List<Contributor>> cachedResponse = get(getHttpCachePath(), cacheKey,
                new TypeToken<List<Contributor>>() {
        }, httpRefreshIntervalMs);

        if (cachedResponse.isPresent() && isCacheEntryStale(getHttpCachePath(), cacheKey, httpRefreshIntervalMs)) {
            invalidate(getHttpCachePath(), cacheKey);
            // Start async refresh but don't wait for it
            doHttpCallAsync(supplier, getHttpCachePath(), cacheKey);
        }

        if (cachedResponse.isPresent()) {
            log.debug("Cache hit for key: {}", cacheKey);
            return cachedResponse;
        }

        log.info("Cache miss for key: {}", cacheKey);
        return doHttpCall(supplier, getHttpCachePath(), cacheKey);
    }

    @Async
    protected <T> CompletableFuture<Void> doHttpCallAsync(Supplier<T> supplier, String cachePath, String cacheKey) {
        return CompletableFuture.runAsync(() -> {
            doHttpCall(supplier, cachePath, cacheKey);
        });
    }

    protected <T> Optional<T> doHttpCall(Supplier<T> supplier, String cachePath, String cacheKey) {
        T response;
        try {
            response = supplier.get();
            put(cachePath, cacheKey, response);
            return Optional.of(response);
        } catch (Exception e) {
            log.error("Error fetching data: {}", e.getMessage());
            return Optional.empty();
        }
    }

    /**
     * Get a value from the cache
     */
    public abstract <T> Optional<T> get(String cachePath, String key, TypeToken<T> typeRef, long refreshInterval);

    /**
     * Put a value in the cache
     */
    public abstract <T> void put(String cachePath, String key, T value);

    /**
     * Remove a value from the cache
     */
    public abstract void invalidate(String cachePath, String key);

    protected abstract String getHttpCachePath();

    protected abstract String getGithubCachePath();

    protected String generateCacheKey(String cityId, String regionId, String stateId, String teamId, String language, int maxResults) {
        StringBuilder key = new StringBuilder();
        key.append(cityId != null ? cityId : NONE)
                .append(getDelimiter())
                .append(regionId != null ? regionId : NONE)
                .append(getDelimiter())
                .append(stateId != null ? stateId : NONE)
                .append(getDelimiter())
                .append(teamId != null ? teamId : NONE)
                .append(getDelimiter())
                .append(language != null ? language : NONE)
                .append(getDelimiter())
                .append(maxResults);
        return key.toString();
    }

    protected String generateGithubCacheKey(City city, String language, int pageNumber) {
        StringBuilder key = new StringBuilder();
        key.append('/')
                .append(city.getId())
                .append("/Contributors")
                .append(getDelimiter())
                .append(language)
                .append(getDelimiter()) 
                .append("page_")
                .append(pageNumber);
        return key.toString();
    }
}
