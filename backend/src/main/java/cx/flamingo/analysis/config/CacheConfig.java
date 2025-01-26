package cx.flamingo.analysis.config;

import org.springframework.beans.factory.annotation.Value;
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
        READ_WRITE("read-write");

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

    @Value("${cache.implementation:redis}")
    private String cacheImplementation;

    @Value("${cache.mode:read-write}")
    private String cacheMode;

    @Bean
    @Primary
    public CacheServiceAbs cacheService(RedisCacheService redisCache, 
                                      DiskCacheService diskCache,
                                      ReadOnlyCacheService readOnlyCache) {
        CacheMode mode = CacheMode.fromString(cacheMode);
        CacheImplementation impl = CacheImplementation.fromString(cacheImplementation);
        
        log.info("Initializing cache with mode: {} and implementation: {}", mode.getValue(), impl.getValue());
        
        if (mode == CacheMode.READ_ONLY) {
            return readOnlyCache;
        }

        return impl == CacheImplementation.REDIS ? redisCache : diskCache;
    }
} 
