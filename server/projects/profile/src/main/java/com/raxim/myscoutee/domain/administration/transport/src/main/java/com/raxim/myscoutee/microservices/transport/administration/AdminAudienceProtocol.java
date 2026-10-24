package com.raxim.myscoutee.microservices.transport.administration;

public final class AdminAudienceProtocol {
    public static final String PATH = "/_internal/v1/administration/notification-audience";
    public static final int MAX_REQUEST_BYTES = 16384;
    private AdminAudienceProtocol() {}
    public record Query(String actorUserId) {}
    public record Error(String code) {}
    public static boolean valid(Query value) { return value != null && (value.actorUserId() == null || value.actorUserId().length() <= 512); }
}
