package cx.flamingo.analysis.cache.impl;

import java.util.Optional;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import cx.flamingo.analysis.cache.CacheServiceAbs;
import cx.flamingo.analysis.cache.model.Expiration;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service("redisCache")
public class RedisCacheService extends CacheServiceAbs {

    private final RedisTemplate<String, Object> redisTemplate;
    protected final ValueOperations<String, Object> valueOps;
    private static final String EXPIRATION_SUFFIX = ":expiration";

    public RedisCacheService(Gson gson,
            RedisTemplate<String, Object> redisTemplate) {
        super(gson);
        this.redisTemplate = redisTemplate;
        this.valueOps = redisTemplate.opsForValue();
    }

    @Override
    public String getDelimiter() {
        return ":";
    }

    @Override
    protected String getGithubCachePath() {
        return "github";
    }

    @Override
    protected String getHttpCachePath() {
        return "http";
    }

    @Override
    protected Long getInsertTime(String cachePath, String key) {
        String redisKey = buildRedisKey(cachePath, key);
        Object json = valueOps.get(redisKey + EXPIRATION_SUFFIX);
        Expiration expiration = gson.fromJson(json.toString(), Expiration.class);
        if (expiration != null) {
            return expiration.getTimestamp();
        }
        return 0L;
    }

    protected String buildRedisKey(String cachePath, String key) {
        return cachePath + getDelimiter() + key;
    }

    @Override
    public <T> Optional<T> get(String cachePath, String key, TypeToken<T> typeRef, Long refreshInterval) {
        String redisKey = buildRedisKey(cachePath, key);
        Object cachedValue = valueOps.get(redisKey);

        if (cachedValue != null) {
            try {
                // Let the RedisTemplate's serializer handle the conversion
                T value = gson.fromJson(cachedValue.toString(), typeRef);
                log.info("Redis cache hit for key: '{}'", redisKey);
                return Optional.of(value);
            } catch (Exception e) {
                log.error("Failed to deserialize Redis cache value for key '{}': {}", redisKey, e.getMessage());
                invalidate(cachePath, key);
            }
        }

        return Optional.empty();
    }

    @Override
    public <T> void put(String cachePath, String key, T value) {
        if (value == null) {
            log.warn("Attempted to cache null value for key: '{}'", key);
            return;
        }

        String redisKey = buildRedisKey(cachePath, key);
        try {
            // Let the RedisTemplate's serializer handle the conversion
            valueOps.set(redisKey, gson.toJson(value));
            valueOps.set(redisKey + EXPIRATION_SUFFIX, gson.toJson(Expiration.builder().timestamp(System.currentTimeMillis())));
            log.debug("Cached value in Redis for key: '{}'", redisKey);
        } catch (Exception e) {
            log.error("Failed to write to Redis cache for key '{}': {}", redisKey, e.getMessage());
        }
    }

    @Override
    public void invalidate(String cachePath, String key) {
        String redisKey = buildRedisKey(cachePath, key);
        try {
            redisTemplate.delete(redisKey);
            redisTemplate.delete(redisKey + EXPIRATION_SUFFIX);
            log.info("Invalidated Redis cache for key: '{}'", redisKey);
        } catch (Exception e) {
            log.error("Failed to invalidate Redis cache for key '{}': {}", redisKey, e.getMessage());
        }
    }
}
