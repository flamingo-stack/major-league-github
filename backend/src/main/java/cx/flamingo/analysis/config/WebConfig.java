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
        registry.addMapping("/**") // Allow CORS for all endpoints, including actuator
            .allowedOrigins(
                // Development origins
                "http://localhost:8450",
                "http://localhost:3000",
                // Production origins
                "https://www.mlg.soccer",
                // Allow the ingress controller origin
                "http://www.mlg.soccer"
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .exposedHeaders("Access-Control-Allow-Origin")
            .allowCredentials(true)
            .maxAge(3600); // 1 hour max age
    }
} 