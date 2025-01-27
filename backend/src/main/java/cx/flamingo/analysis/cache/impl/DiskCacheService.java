package cx.flamingo.analysis.cache.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import cx.flamingo.analysis.cache.CacheServiceAbs;
import cx.flamingo.analysis.config.CacheConfig.CacheMode;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service("diskCache")
public class DiskCacheService extends CacheServiceAbs {

    @Value("${github.cache.path}")
    protected String githubCachePath;

    @Value("${http.cache.path}")
    protected String httpCachePath;

    public DiskCacheService(Gson gson) {
        super(gson);
    }

    @Override
    public String getDelimiter() {
        return "/";
    }

    @PostConstruct
    private void init() {
        createCacheDirectory(getGithubCachePath());
        createCacheDirectory(getHttpCachePath());
    }

    @Override
    protected String getGithubCachePath() {
        return githubCachePath;
    }

    @Override
    protected String getHttpCachePath() {
        return httpCachePath;
    }

    @Override
    protected Long getInsertTime(String cachePath, String key) {
        Path filePath = Paths.get(cachePath, key + ".json");
        try {
            BasicFileAttributes attrs = Files.readAttributes(filePath, BasicFileAttributes.class);
            return attrs.lastModifiedTime().toMillis();
        } catch (IOException e) {
            log.error("Error getting insert time: {}", e.getMessage());
            return 0l;
        }
    }

    private void createCacheDirectory(String path) {
        try {
            Files.createDirectories(Paths.get(path));
            log.info("Cache directory created at: {}", path);
        } catch (IOException e) {
            log.error("Failed to create cache directory: {}", e.getMessage());
        }
    }

    @Override
    public <T> Optional<T> get(String cachePath, String key, TypeToken<T> typeRef, Long refreshInterval) {
        Path filePath = Paths.get(cachePath, key + ".json");

        if (!Files.exists(filePath)) {
            log.debug("Cache miss for key: '{}'", key);
            return Optional.empty();
        }

        if (isCacheEntryStale(cachePath, key, refreshInterval)) {
            log.debug("Cache entry is stale for key: '{}'", key);
            try {
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                log.error("Failed to delete stale cache file for key '{}': {}", key, e.getMessage());
            }
            return Optional.empty();
        }

        try {
            String jsonStr = Files.readString(filePath);

            // Check if file is empty or malformed
            if (jsonStr == null || jsonStr.trim().isEmpty()) {
                log.warn("Empty cache file found for key: '{}', deleting", key);
                Files.deleteIfExists(filePath);
                return Optional.empty();
            }

            T value = gson.fromJson(jsonStr, typeRef);
            log.info("Cache hit for key: '{}'", key);
            return Optional.of(value);
        } catch (IOException e) {
            log.error("Failed to read cache for key '{}': {}", key, e.getMessage());
            try {
                Files.deleteIfExists(filePath);
            } catch (IOException ex) {
                log.error("Failed to delete corrupted cache file for key '{}': {}", key, ex.getMessage());
            }
            return Optional.empty();
        }
    }

    @Override
    public <T> void put(String cachePath, String key, T value) {
        if (value == null) {
            log.warn("Attempted to cache null value for key: '{}'", key);
            return;
        }

        Path filePath = Paths.get(cachePath, key + ".json");
        try {
            Files.createDirectories(filePath.getParent());

            String jsonStr = gson.toJson(value);

            // Validate JSON before writing
            if (jsonStr == null || jsonStr.trim().isEmpty()) {
                log.warn("Attempted to cache empty JSON for key: '{}'", key);
                return;
            }

            Files.writeString(filePath, jsonStr);
            log.info("Cached value in file system for key: '{}'", key);
        } catch (IOException e) {
            log.error("Failed to write file cache for key '{}': {}", key, e.getMessage());
        }
    }

    @Override
    public void invalidate(String cachePath, String key) {
        Path filePath = Paths.get(cachePath, key + ".json");
        try {
            Files.deleteIfExists(filePath);
            log.info("Invalidated file cache for key: '{}'", key);
        } catch (IOException e) {
            log.error("Failed to invalidate file cache for key '{}': {}", key, e.getMessage());
        }
    }

}
