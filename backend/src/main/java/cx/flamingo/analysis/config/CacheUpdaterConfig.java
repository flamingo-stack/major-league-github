package cx.flamingo.analysis.config;

import org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@Profile("cache-updater")
@EnableScheduling
public class CacheUpdaterConfig extends WebMvcAutoConfiguration {
    // Cache updater specific configuration can be added here
} 