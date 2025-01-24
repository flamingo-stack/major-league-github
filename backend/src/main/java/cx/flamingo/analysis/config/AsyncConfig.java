package cx.flamingo.analysis.config;

import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import jakarta.annotation.PreDestroy;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
public class AsyncConfig {

    private ThreadPoolTaskExecutor executorLow;

    @Bean(name = "contributorsAsyncExecutorLow")
    public ThreadPoolExecutor contributorsAsyncExecutorLow() {
        executorLow = new ThreadPoolTaskExecutor();
        executorLow.setCorePoolSize(4);
        executorLow.setMaxPoolSize(100);
        executorLow.setQueueCapacity(1000);
        executorLow.setThreadNamePrefix("GithuhContributorsLow-");
        executorLow.setWaitForTasksToCompleteOnShutdown(true); // Wait for tasks to complete
        executorLow.setAwaitTerminationSeconds(60); // Wait up to 60 seconds
        executorLow.initialize();
        return executorLow.getThreadPoolExecutor();
    }

    private ThreadPoolTaskExecutor executorHigh;

    @Bean(name = "contributorsAsyncExecutorHigh")
    public ThreadPoolExecutor contributorsAsyncExecutorHigh() {
        executorHigh = new ThreadPoolTaskExecutor();
        executorHigh.setCorePoolSize(4);
        executorHigh.setMaxPoolSize(100);
        executorHigh.setQueueCapacity(1000);
        executorHigh.setThreadNamePrefix("GithuhContributorsHigh-");
        executorHigh.setWaitForTasksToCompleteOnShutdown(true); // Wait for tasks to complete
        executorHigh.setAwaitTerminationSeconds(60); // Wait up to 60 seconds
        executorHigh.initialize();
        return executorHigh.getThreadPoolExecutor();
    }

    @PreDestroy
    public void shutdown() {
        shutdownThreadPoolExecutor(this.executorLow);
        shutdownThreadPoolExecutor(this.executorHigh);
    }

    public void shutdownThreadPoolExecutor(ThreadPoolTaskExecutor executor) {
        if (executor != null) {
            log.info("Shutting down Contributors thread pool...");
            executor.shutdown();
            try {
                if (!executor.getThreadPoolExecutor().awaitTermination(10, TimeUnit.SECONDS)) {
                    log.warn("Thread pool did not terminate in time. Forcing shutdown...");
                    executor.getThreadPoolExecutor().shutdownNow();
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                log.error("Thread pool shutdown interrupted", e);
                executor.getThreadPoolExecutor().shutdownNow();
            }
            log.info("Thread pool shutdown completed");
        }
    }
}
