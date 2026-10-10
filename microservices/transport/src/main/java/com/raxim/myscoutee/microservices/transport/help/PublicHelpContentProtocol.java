package com.raxim.myscoutee.microservices.transport.help;

public final class PublicHelpContentProtocol {
    public static final String PATH = "/_internal/v1/help/public-content";
    public static final int MAX_REQUEST_BYTES = 16384, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private PublicHelpContentProtocol() {}
    public record Query(String documentType, String lang, String acceptLanguage, String contextKey, String baseGroupId) {}
    public record Error(String code) {}
    public static boolean valid(Query q) {
        return q != null && text(q.documentType(), 512) && text(q.lang(), 512)
                && text(q.acceptLanguage(), 8192) && text(q.contextKey(), 512) && text(q.baseGroupId(), 512);
    }
    private static boolean text(String value, int limit) { return value == null || value.length() <= limit; }
}
