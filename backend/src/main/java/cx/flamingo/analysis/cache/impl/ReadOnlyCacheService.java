package cx.flamingo.analysis.cache.impl;

import java.util.List;
import java.util.Optional;
import java.util.function.Supplier;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;

import cx.flamingo.analysis.model.City;
import cx.flamingo.analysis.model.Contributor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service("readOnlyCache")
public class ReadOnlyCacheService extends RedisCacheService {

    public ReadOnlyCacheService(Gson gson, RedisTemplate<String, Object> redisTemplate) {
        super(gson, redisTemplate);
        log.info("Initializing read-only cache service for web profile");
    }

    @Override
    public <T> void put(String cachePath, String key, T value) {
        // Silently ignore writes in read-only mode
        log.trace("Ignoring put operation in read-only mode for key: '{}'", key);
    }

    @Override
    public void invalidate(String cachePath, String key) {
        // Silently ignore invalidation in read-only mode
        log.trace("Ignoring invalidate operation in read-only mode for key: '{}'", key);
    }

    @Override
    public <T> Optional<T> get(String cachePath, String key, TypeToken<T> typeRef, long refreshInterval) {
        // Always return cached value regardless of refresh interval
        String redisKey = buildRedisKey(cachePath, key);
        Object cachedValue = valueOps.get(redisKey);

        if (cachedValue != null) {
            try {
                T value = gson.fromJson(cachedValue.toString(), typeRef);
                log.debug("Read-only cache hit for key: '{}'", redisKey);
                return Optional.of(value);
            } catch (Exception e) {
                log.error("Failed to deserialize read-only cache value for key '{}': {}", redisKey, e.getMessage());
            }
        } else {
            log.debug("Read-only cache miss for key: '{}'", redisKey);
        }

        return Optional.empty();
    }

    @Override
    protected Long getInsertTime(String cachePath, String key) {
        // In read-only mode, we don't care about insert time
        return 0L;
    }

    @Override
    public Optional<JsonObject> getGitHubApiResponse(City city, String language, int pageNumber, Supplier<JsonObject> supplier) {
        String cacheKey = generateGithubCacheKey(city, language, pageNumber);
        Optional<JsonObject> cachedResponse = get(getGithubCachePath(), cacheKey, new TypeToken<JsonObject>() {}, githubRefreshIntervalMs);
        
        if (cachedResponse.isPresent()) {
            log.debug("Read-only cache hit for GitHub API response - city: {}, language: {}, page: {}", 
                     city.getId(), language, pageNumber);
            return cachedResponse;
        }
        
        log.debug("Read-only cache miss for GitHub API response - city: {}, language: {}, page: {}", 
                 city.getId(), language, pageNumber);
        return Optional.empty();
    }

    @Override
    public Optional<List<Contributor>> getHttpResponse(String cityId, String regionId, String stateId, 
                                                     String teamId, String languageId, int maxResults, 
                                                     Supplier<List<Contributor>> supplier) {
        String cacheKey = generateCacheKey(cityId, regionId, stateId, teamId, languageId, maxResults);
        Optional<List<Contributor>> cachedResponse = get(getHttpCachePath(), cacheKey, 
                new TypeToken<List<Contributor>>() {}, httpRefreshIntervalMs);
        
        if (cachedResponse.isPresent()) {
            log.debug("Read-only cache hit for query: city={}, region={}, state={}, team={}, language={}, maxResults={}", 
                     cityId, regionId, stateId, teamId, languageId, maxResults);
            return cachedResponse;
        }
        
        log.debug("Read-only cache miss for query: city={}, region={}, state={}, team={}, language={}, maxResults={}", 
                 cityId, regionId, stateId, teamId, languageId, maxResults);
        return Optional.empty();
    }
} 