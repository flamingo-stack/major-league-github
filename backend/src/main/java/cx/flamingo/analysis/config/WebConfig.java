package cx.flamingo.analysis.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${spring.profiles.active:default}")
    private String activeProfile;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Allow localhost ports for development
        registry.addMapping("/api/**")
            .allowedOrigins(
                "http://localhost:8450",  // Frontend dev server
                "http://localhost:3000",  // Common React dev port
                "https://major-league-github.flamingo.cx" // Production URL
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600); // 1 hour max age
    }
} 