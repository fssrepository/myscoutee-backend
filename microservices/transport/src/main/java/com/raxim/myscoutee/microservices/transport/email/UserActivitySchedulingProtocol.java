package com.raxim.myscoutee.microservices.transport.email;

public final class UserActivitySchedulingProtocol {
    public static final String PATH="/_internal/v1/email/user-activity";
    public static final String AUDIENCE="email:user-activity:touch";
    public static final int MAX_REQUEST_BYTES=4096;
    private UserActivitySchedulingProtocol() {}
    public record Command(String userId) {}
    public record Receipt(boolean completed) {}
    public record Error(String code) {}
}
