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

import cx.flamingo.analysis.config.CacheConfig.CacheMode;
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

    @Value("${cache.should.be.ready:false}")
    protected boolean cacheShouldBeReady;

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

    protected boolean isCacheEntryStale(String cachePath, String key, Long refreshInterval) {
        try {
            Long lastModified = getInsertTime(cachePath, key);
            if (refreshInterval == null) {
                return false;
            }

            if (lastModified == null) {
                return true;
            }
            Long age = System.currentTimeMillis() - lastModified;
            boolean isStale = age > refreshInterval;
            if (isStale) {
                log.info("Cache entry is stale (age: {} minutes): {}", Duration.ofMillis(age).toMinutes(),
                        cachePath + ":" + key);
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
    public Optional<JsonObject> getGitHubApiResponse(City city, String language, int pageNumber,
            Supplier<JsonObject> supplier) {
        String cacheKey = generateGithubCacheKey(city, language, pageNumber);

        fetchFromCache: {
            if (forceCacheUpdate()) {
                break fetchFromCache;
            }

            Optional<JsonObject> cachedResponse = get(getGithubCachePath(), cacheKey, new TypeToken<JsonObject>() {
            }, githubRefreshIntervalMs);

            if (cachedResponse.isPresent()
                    && isCacheEntryStale(getGithubCachePath(), cacheKey, githubRefreshIntervalMs)) {
                // Don't invalidate the cache entry now, refresh it asynchronously first
                // and only replace it once we have the new data
                doHttpCallAsync(supplier, getGithubCachePath(), cacheKey);
            }

            if (cachedResponse.isPresent()) {
                log.debug("Cache hit for GitHub API response - city: {}, language: {}, page: {}",
                        city.getId(), language, pageNumber);
                return cachedResponse;
            }
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

        fetchFromCache: {
            if (forceCacheUpdate()) {
                break fetchFromCache;
            }

            Optional<List<Contributor>> cachedResponse = get(getHttpCachePath(), cacheKey,
                    new TypeToken<List<Contributor>>() {
                    }, httpRefreshIntervalMs);

            if (cachedResponse.isPresent() && isCacheEntryStale(getHttpCachePath(), cacheKey, httpRefreshIntervalMs)) {
                // Don't invalidate the cache entry now, refresh it asynchronously first
                // and only replace it once we have the new data
                doHttpCallAsync(supplier, getHttpCachePath(), cacheKey);
            }

            if (cachedResponse.isPresent()) {
                log.debug("Cache hit for key: {}", cacheKey);
                return cachedResponse;
            }

            log.info("Cache miss for key: {}", cacheKey);
        }
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
    public abstract <T> Optional<T> get(String cachePath, String key, TypeToken<T> typeRef, Long refreshInterval);

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

    protected String generateCacheKey(String cityId, String regionId, String stateId, String teamId, String language,
            int maxResults) {
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
        key.append(getDelimiter())
                .append(city.getId())
                .append(getDelimiter())
                .append(language)
                .append(getDelimiter())
                .append("page_")
                .append(pageNumber);
        return key.toString();
    }

    public boolean isCacheReady() {

        if (!cacheShouldBeReady) {
            return true;
        }

        Optional<Boolean> isReady = get(CACHE_IS_READY_PATH, CACHE_IS_READY_KEY, new TypeToken<Boolean>() {
        }, null);

        return isReady.isPresent() && isReady.get();
    }

    private static final String CACHE_IS_READY_PATH = "cache_is_ready";
    private static final String CACHE_IS_READY_KEY = "cache_is_ready";

    public void setCacheIsReady(boolean isReady) {
        put(CACHE_IS_READY_PATH, CACHE_IS_READY_KEY, isReady);
    }

    public boolean forceCacheUpdate() {
        return getCacheMode() == CacheMode.FORCE_UPDATE;
    }

    private CacheMode cacheMode = CacheMode.READ_WRITE;

    private CacheMode getCacheMode() {
        return cacheMode;
    }

    public void setCacheMode(CacheMode cacheMode) {
        this.cacheMode = cacheMode;
    }
}
