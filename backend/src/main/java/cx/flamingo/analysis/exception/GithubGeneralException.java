package cx.flamingo.analysis.exception;

public class GithubGeneralException extends RuntimeException {
    public GithubGeneralException(String message) {
        super(message);
    }
    
    public GithubGeneralException(String message, Throwable cause) {
        super(message, cause);
    }
}
