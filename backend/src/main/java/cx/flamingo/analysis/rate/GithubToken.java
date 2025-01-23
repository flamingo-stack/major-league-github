package cx.flamingo.analysis.rate;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class GithubToken {
    // Token value
    private String token;

    // Primary rate limit fields
    private Integer remainingRequests;  // X-RateLimit-Remaining
    private Long resetTime;             // X-RateLimit-Reset (Unix timestamp)
    private Integer rateLimit;          // X-RateLimit-Limit
    private Integer usedRequests;       // X-RateLimit-Used

    // Secondary rate limit fields
    private Integer retryAfterSeconds;  // Retry-After header when hitting secondary limit
    private Long lastSecondaryLimitHit; // Timestamp when we last hit secondary limit

    /**
     * Checks if this token is currently under a secondary rate limit
     * @return true if token is under secondary limit and retry period hasn't elapsed
     */
    public boolean isUnderSecondaryLimit() {
        if (retryAfterSeconds == null || lastSecondaryLimitHit == null) {
            return false;
        }
        long elapsedSeconds = (System.currentTimeMillis() - lastSecondaryLimitHit) / 1000;
        return elapsedSeconds < retryAfterSeconds;
    }

    /**
     * Checks if this token has any remaining requests
     * @return true if token has remaining requests and is not under secondary limit
     */
    public boolean hasRemainingRequests() {
        return remainingRequests != null && 
               remainingRequests > 0 && 
               !isUnderSecondaryLimit();
    }

    /**
     * Gets the number of seconds until the rate limit resets
     * @return seconds until reset, or 0 if reset time is in the past or not set
     */
    public long getSecondsUntilReset() {
        if (resetTime == null) {
            return 0;
        }
        long now = Instant.now().getEpochSecond();
        return Math.max(0, resetTime - now);
    }
}
