package cx.flamingo.analysis.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@Configuration
@Profile("backend-service")
@EnableWebMvc
public class BackendServiceConfig {
    // Backend-specific configuration can be added here
} 