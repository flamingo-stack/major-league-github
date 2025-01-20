package cx.flamingo.analysis.exception;

public class GithubTooFastException extends RuntimeException {

    public GithubTooFastException(String message) {
        super(message);
    }

    public GithubTooFastException(String message, Throwable cause) {
        super(message, cause);
    }
}
