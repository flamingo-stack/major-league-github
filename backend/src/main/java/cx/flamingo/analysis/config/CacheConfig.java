package cx.flamingo.analysis.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import cx.flamingo.analysis.cache.CacheServiceAbs;
import cx.flamingo.analysis.cache.impl.DiskCacheService;
import cx.flamingo.analysis.cache.impl.RedisCacheService;

@Configuration
public class CacheConfig {

    @Value("${cache.implementation:redis}")
    private String cacheImplementation;

    @Bean
    @Primary
    public CacheServiceAbs cacheService(RedisCacheService redisCache, DiskCacheService diskCache) {
        return "redis".equalsIgnoreCase(cacheImplementation) ? redisCache : diskCache;
    }
} 
