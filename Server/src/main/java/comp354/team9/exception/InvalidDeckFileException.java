package comp354.team9.exception;

public class InvalidDeckFileException extends RuntimeException {

    public InvalidDeckFileException(String message) {
        super(message);
    }

    public InvalidDeckFileException(String message, Throwable cause) {
        super(message, cause);
    }
}
