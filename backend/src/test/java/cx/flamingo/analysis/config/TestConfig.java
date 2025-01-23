package cx.flamingo.analysis.config;

import java.util.Properties;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;

import lombok.extern.slf4j.Slf4j;

@TestConfiguration
@Slf4j
public class TestConfig {
    
    @Bean
    @Primary
    public static PropertySourcesPlaceholderConfigurer properties() {
        PropertySourcesPlaceholderConfigurer configurer = new PropertySourcesPlaceholderConfigurer();
        Properties props = new Properties();
        
        // Always use test token in test environment
        props.setProperty("github.tokens", "test_token");
        props.setProperty("scheduler.enabled", "false");
        configurer.setProperties(props);
        return configurer;
    }
} 