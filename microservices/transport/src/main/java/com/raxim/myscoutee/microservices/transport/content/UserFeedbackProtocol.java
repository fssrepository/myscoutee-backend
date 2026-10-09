package com.raxim.myscoutee.microservices.transport.content;

public final class UserFeedbackProtocol {
    public static final String PATH="/_internal/v1/content/user-feedback";
    public static final String AUDIENCE="content:feedback:submit";
    public static final int MAX_REQUEST_BYTES=64*1024;
    private UserFeedbackProtocol() {}
    public record Command(String requestId,String userId,String category,String subject,String details) {}
    public record Receipt(String id) {}
    public record Error(String code) {}
}
