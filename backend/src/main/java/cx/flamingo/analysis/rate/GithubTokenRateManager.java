package cx.flamingo.analysis.rate;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.javatuples.Pair;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Getter
public class GithubTokenRateManager {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Value("${github.tokens}")
    private List<String> tokens;

    @Value("${github.api.url.rate_limit}")
    private String githubApiUrlRateLimit;

    @Value("${github.api.url}")
    private String githubApiUrl;

    private final HashMap<String, Pair<GithubToken, WebClient>> tokenMap = new HashMap<>();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    @PostConstruct
    public void init() {

        // Initialize WebClient for each token with increased buffer size
        ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(1024 * 1024)) // 1MB buffer
                .build();

        for (String token : tokens) {
            tokenMap.put(token, Pair.with(GithubToken.builder().token(token).build(), WebClient.builder()
                    .baseUrl(githubApiUrl)
                    .defaultHeader("Authorization", "Bearer " + token)
                    .exchangeStrategies(strategies)
                    .build()));
        }

    }

    boolean alreadyInitialized = false;

    private String formatResetTime(Long resetTimeSeconds) {
        if (resetTimeSeconds == null) {
            return "N/A";
        }
        return LocalDateTime.ofInstant(
                Instant.ofEpochSecond(resetTimeSeconds),
                ZoneId.systemDefault()
        ).format(DATE_FORMATTER);
    }

    private void printTokensStatus() {
        log.info("=== GitHub Tokens Status Summary ===");
        log.info("Total tokens: {}", tokenMap.size());

        int totalRemaining = 0;
        for (Map.Entry<String, Pair<GithubToken, WebClient>> entry : tokenMap.entrySet()) {
            GithubToken token = entry.getValue().getValue0();
            totalRemaining += token.getRemainingRequests() != null ? token.getRemainingRequests() : 0;

            log.info("Token {}: Remaining={}, Reset={}, Limit={}",
                    entry.getKey().substring(0, 8),
                    token.getRemainingRequests() != null ? token.getRemainingRequests() : "N/A",
                    formatResetTime(token.getResetTime()),
                    token.getRateLimit() != null ? token.getRateLimit() : "N/A");
        }
        log.info("Total remaining requests: {}", totalRemaining);
        log.info("================================");
    }

    /**
     * Updates rate limit information for all tokens. Calls GitHub's rate limit
     * endpoint to get remaining requests and reset time.
     */
    public synchronized void initializeRateLimits() {
        if (alreadyInitialized) {
            return;
        }
        alreadyInitialized = true;
        for (Map.Entry<String, Pair<GithubToken, WebClient>> entry : tokenMap.entrySet()) {
            String token = entry.getKey();
            try {
                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(githubApiUrlRateLimit))
                        .header("Authorization", "Bearer " + token)
                        .header("Accept", "application/vnd.github.v3+json")
                        .GET()
                        .build();

                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

                if (response.statusCode() == 200) {
                    GithubToken githubToken = entry.getValue().getValue0();
                    updateTokenRateLimits(githubToken, response.headers().map());
                } else {
                    log.error("Failed to get rate limit for token {}: Status {}",
                            token.substring(0, 8), response.statusCode());
                }
            } catch (Exception e) {
                log.error("Error checking rate limit for token {}: {}",
                        token.substring(0, 8), e.getMessage());
            }
        }
        printTokensStatus();
    }

    /**
     * Returns the WebClient with the most remaining API calls and furthest reset time.
     * If all tokens are exhausted, waits for the earliest reset time.
     * @return WebClient with optimal rate limit status
     */
    public Pair<WebClient, GithubToken> getBestAvailableClient() {
        WebClient bestClient = null;
        GithubToken bestToken = null;
        int maxRemaining = -1;
        long latestReset = 0;
        long earliestReset = Long.MAX_VALUE;
        long earliestSecondaryReset = Long.MAX_VALUE;

        for (Map.Entry<String, Pair<GithubToken, WebClient>> entry : tokenMap.entrySet()) {
            GithubToken token = entry.getValue().getValue0();
            WebClient client = entry.getValue().getValue1();
            
            // Skip tokens under secondary rate limit
            if (token.isUnderSecondaryLimit()) {
                long secondaryResetTime = token.getLastSecondaryLimitHit()/1000 + token.getRetryAfterSeconds();
                if (secondaryResetTime < earliestSecondaryReset) {
                    earliestSecondaryReset = secondaryResetTime;
                }
                continue;
            }
            
            Integer remaining = token.getRemainingRequests();
            Long resetTime = token.getResetTime();
            
            // Skip if we don't have rate limit info
            if (remaining == null || resetTime == null) {
                continue;
            }

            // Track earliest reset time for waiting when all tokens are exhausted
            if (resetTime < earliestReset) {
                earliestReset = resetTime;
            }

            // If this token has more remaining calls, or same calls but later reset
            if (remaining > maxRemaining || 
                (remaining == maxRemaining && resetTime > latestReset)) {
                maxRemaining = remaining;
                latestReset = resetTime;
                bestClient = client;
                bestToken = token;
            }
        }

        long now = Instant.now().getEpochSecond();
        
        // If all tokens are under secondary rate limit, wait for the earliest one
        if (bestClient == null && earliestSecondaryReset != Long.MAX_VALUE) {
            long waitTime = earliestSecondaryReset - now;
            if (waitTime > 0) {
                log.info("All tokens under secondary rate limit. Waiting {} seconds until first token available", waitTime);
                try {
                    Thread.sleep(waitTime * 1000);
                    return getBestAvailableClient();
                } catch (InterruptedException e) {
                    log.error("Sleep interrupted while waiting for secondary rate limit", e);
                    Thread.currentThread().interrupt();
                }
            }
        }

        // If all tokens are exhausted (maxRemaining == 0), wait for the earliest reset
        if (maxRemaining == 0 && earliestReset != Long.MAX_VALUE) {
            long waitTime = earliestReset - now;
            if (waitTime > 0) {
                log.info("All tokens exhausted. Waiting {} seconds until first token refresh at {}", 
                    waitTime, formatResetTime(earliestReset));
                try {
                    Thread.sleep(waitTime * 1000);
                    initializeRateLimits();
                    return getBestAvailableClient();
                } catch (InterruptedException e) {
                    log.error("Sleep interrupted while waiting for token refresh", e);
                    Thread.currentThread().interrupt();
                }
            }
        }

        // If best token needs to wait for primary rate limit reset, wait
        if (bestToken != null && maxRemaining == 0) {
            long waitTime = bestToken.getSecondsUntilReset();
            if (waitTime > 0) {
                log.info("Best token needs to wait {} seconds until rate limit reset", waitTime);
                try {
                    Thread.sleep(waitTime * 1000);
                    initializeRateLimits();
                    return getBestAvailableClient();
                } catch (InterruptedException e) {
                    log.error("Sleep interrupted while waiting for token reset", e);
                    Thread.currentThread().interrupt();
                }
            }
        }

        // If no client found with rate info, return the first one
        if (bestClient == null && !tokenMap.isEmpty()) {
            log.warn("No rate limit information available, returning first available client");
            bestClient = tokenMap.values().iterator().next().getValue1();
            bestToken = tokenMap.values().iterator().next().getValue0();
        }

        if (bestClient != null) {
            log.debug("Selected token {} with {} remaining calls, reset at {}", 
                bestToken.getToken().substring(0, 8),
                maxRemaining, 
                formatResetTime(latestReset));
        }

        return Pair.with(bestClient, bestToken);
    }

    /**
     * Updates a token's rate limits based on response headers.
     * @param token The token to update
     * @param headers The response headers containing rate limit information
     */
    public void updateTokenRateLimits(GithubToken token, Map<String, List<String>> headers) {
        // Primary rate limits
        String remaining = getFirstHeader(headers, "X-RateLimit-Remaining");
        String reset = getFirstHeader(headers, "X-RateLimit-Reset");
        String limit = getFirstHeader(headers, "X-RateLimit-Limit");
        String usedPoints = getFirstHeader(headers, "X-RateLimit-Used");

        // Secondary rate limits
        String retryAfter = getFirstHeader(headers, "Retry-After");
        // Note: GitHub doesn't provide specific headers for secondary rate limits
        // We'll remove these as they don't exist in the API
        // String secondaryRemaining = getFirstHeader(headers, "x-secondaryrate-remaining");
        // String secondaryLimit = getFirstHeader(headers, "x-secondaryrate-limit");

        // Update primary rate limits
        if (remaining != null) {
            token.setRemainingRequests(Integer.parseInt(remaining));
        }
        if (reset != null) {
            token.setResetTime(Long.parseLong(reset));
        }
        if (limit != null) {
            token.setRateLimit(Integer.parseInt(limit));
        }
        if (usedPoints != null) {
            token.setUsedRequests(Integer.parseInt(usedPoints));
        }

        // Update secondary rate limits
        if (retryAfter != null) {
            token.setRetryAfterSeconds(Integer.parseInt(retryAfter));
            token.setLastSecondaryLimitHit(System.currentTimeMillis());
        }

        // Log rate limit information
        log.debug("Token {} - Primary limits: Remaining={}/{}, Reset={}, Used={}",
                token.getToken().substring(0, 8),
                token.getRemainingRequests(),
                token.getRateLimit(),
                formatResetTime(token.getResetTime()),
                token.getUsedRequests());
        
        if (retryAfter != null) {
            log.debug("Token {} - Secondary rate limit hit: Retry-After={}, Last hit={}",
                token.getToken().substring(0, 8),
                token.getRetryAfterSeconds(),
                token.getLastSecondaryLimitHit() != null ? 
                    Instant.ofEpochMilli(token.getLastSecondaryLimitHit()).toString() : "N/A");
        }
    }

    /**
     * Helper method to safely get the first value from a header
     */
    private String getFirstHeader(Map<String, List<String>> headers, String headerName) {
        List<String> values = headers.get(headerName);
        return values != null && !values.isEmpty() ? values.get(0) : null;
    }
}


