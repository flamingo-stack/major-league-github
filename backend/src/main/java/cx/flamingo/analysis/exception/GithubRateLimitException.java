package cx.flamingo.analysis.exception;

public class GithubRateLimitException extends RuntimeException {

    public GithubRateLimitException(String message) {
        super(message);
    }

    public GithubRateLimitException(String message, Throwable cause) {
        super(message, cause);
    }

}
