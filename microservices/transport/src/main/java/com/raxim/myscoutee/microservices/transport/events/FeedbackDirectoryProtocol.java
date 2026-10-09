package com.raxim.myscoutee.microservices.transport.events;

public final class FeedbackDirectoryProtocol {
    public static final String PATH = "/_internal/v1/events/feedback-directory";
    public static final int MAX_RESPONSE_BYTES = 2 * 1024 * 1024;
    private FeedbackDirectoryProtocol() {}
    public record Error(String code) {}
}
