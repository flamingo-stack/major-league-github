package cx.flamingo.analysis.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import cx.flamingo.analysis.cache.CacheServiceAbs;
import cx.flamingo.analysis.cache.impl.DiskCacheService;
import cx.flamingo.analysis.cache.impl.ReadOnlyCacheService;
import cx.flamingo.analysis.cache.impl.RedisCacheService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
public class CacheConfig {

    @Getter
    @RequiredArgsConstructor
    public enum CacheMode {
        READ_ONLY("read-only"),
        READ_WRITE("read-write"),
        FORCE_UPDATE("force-update");

        private final String value;

        public static CacheMode fromString(String mode) {
            for (CacheMode cacheMode : values()) {
                if (cacheMode.value.equalsIgnoreCase(mode)) {
                    return cacheMode;
                }
            }
            throw new IllegalArgumentException("Invalid cache mode: " + mode + ". Must be 'read-only' or 'read-write'");
        }
    }

    @Getter
    @RequiredArgsConstructor
    public enum CacheImplementation {
        REDIS("redis"),
        DISK("disk");

        private final String value;

        public static CacheImplementation fromString(String impl) {
            for (CacheImplementation cacheImpl : values()) {
                if (cacheImpl.value.equalsIgnoreCase(impl)) {
                    return cacheImpl;
                }
            }
            throw new IllegalArgumentException("Invalid cache implementation: " + impl + ". Must be 'redis' or 'disk'");
        }
    }

    @Value("${cache.mode:read-write}")
    private String cacheMode;

    @Bean
    @Primary
    @ConditionalOnProperty(name = "cache.mode", havingValue = "read-only", matchIfMissing = false)
    public CacheServiceAbs cacheServiceReadOnly(ReadOnlyCacheService readOnlyCache) {
        CacheMode mode = CacheMode.fromString(cacheMode);
        readOnlyCache.setCacheMode(mode);
        log.info("Initializing cache with mode: {} and implementation: read-only", mode.getValue());
        return readOnlyCache;
    }

    @Bean
    @Primary
    @ConditionalOnProperty(name = "cache.implementation", havingValue = "redis", matchIfMissing = true)
    @ConditionalOnProperty(name = "cache.mode", havingValue = "read-only", matchIfMissing = false)
    public CacheServiceAbs cacheServiceRedis(RedisCacheService redisCache) {
        CacheMode mode = CacheMode.fromString(cacheMode);
        redisCache.setCacheMode(mode);
        log.info("Initializing cache with mode: {} and implementation: redis", mode.getValue());
        return redisCache;
    }

    @Bean
    @Primary
    @ConditionalOnProperty(name = "cache.implementation", havingValue = "disk")
    @ConditionalOnProperty(name = "cache.mode", havingValue = "read-only", matchIfMissing = false)
    public CacheServiceAbs cacheServiceDisk(DiskCacheService diskCache) {
        CacheMode mode = CacheMode.fromString(cacheMode);
        diskCache.setCacheMode(mode);
        log.info("Initializing cache with mode: {} and implementation: disk", mode.getValue());
        return diskCache;
    }
}
