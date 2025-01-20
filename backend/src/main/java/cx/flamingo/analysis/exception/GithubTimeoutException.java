package cx.flamingo.analysis.exception;

public class GithubTimeoutException extends RuntimeException {

    public GithubTimeoutException(String message) {
        super(message);
    }

    public GithubTimeoutException(String message, Throwable cause) {
        super(message, cause);
    }

}